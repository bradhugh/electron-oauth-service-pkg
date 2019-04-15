"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const AdalErrorCode_1 = require("../AdalErrorCode");
const AdalServiceError_1 = require("../AdalServiceError");
const AuthenticationResultEx_1 = require("../AuthenticationResultEx");
const Constants_1 = require("../Constants");
const ConsoleLogger_1 = require("../core/ConsoleLogger");
const Authenticator_1 = require("../instance/Authenticator");
const InstanceDiscovery_1 = require("../instance/InstanceDiscovery");
const TokenCacheKey_1 = require("../internal/cache/TokenCacheKey");
const CallState_1 = require("../internal/CallState");
const AdalIdHelper_1 = require("../internal/helpers/AdalIdHelper");
const AdalHttpClient_1 = require("../internal/http/AdalHttpClient");
const OAuthConstants_1 = require("../internal/oauth2/OAuthConstants");
const TokenResponse_1 = require("../internal/oauth2/TokenResponse");
const PlatformInformation_1 = require("../internal/platform/PlatformInformation");
const RequestParameters_1 = require("../internal/RequestParameters");
const TokenCacheNotificationArgs_1 = require("../TokenCacheNotificationArgs");
const Utils_1 = require("../Utils");
const BrokerParameter_1 = require("./BrokerParameter");
class AcquireTokenHandlerBase {
    constructor(requestData, logger) {
        this.loadFromCache = false;
        this.storeToCache = false;
        this.platformInformation = new PlatformInformation_1.PlatformInformation();
        this.brokerParameters = null;
        this.cacheQueryData = {
            assertionHash: null,
            authority: null,
            clientId: null,
            displayableId: null,
            extendedLifeTimeEnabled: false,
            resource: null,
            subjectType: TokenCacheKey_1.TokenSubjectType.User,
            uniqueId: null,
        };
        this.client = null;
        this.authenticator = requestData.authenticator;
        this.callState = AcquireTokenHandlerBase.createCallState(requestData.correlationId !== Utils_1.Utils.guidEmpty ?
            requestData.correlationId : this.authenticator.correlationId, logger);
        this.tokenCache = requestData.tokenCache;
        if (!requestData.resource) {
            throw new Error("requestData.resource must be set");
        }
        this.resource = requestData.resource !== AcquireTokenHandlerBase.nullResource ? requestData.resource : null;
        this.clientKey = requestData.clientKey;
        this.tokenSubjectType = requestData.subjectType;
        this.loadFromCache = !!this.tokenCache;
        this.storeToCache = !!this.tokenCache;
        this.supportADFS = false;
        this.brokerParameters = new Map();
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.authority, requestData.authenticator.authority);
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.resource, requestData.resource);
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.clientId, requestData.clientKey.clientId);
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.correlationId, this.callState.correlationId);
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.clientVersion, AdalIdHelper_1.AdalIdHelper.getClientVersion());
        this.resultEx = null;
        this.cacheQueryData.extendedLifeTimeEnabled = requestData.extendedLifeTimeEnabled;
        let msg = `ADAL ${this.platformInformation.getProductName()} ` +
            `with assembly version '${AdalIdHelper_1.AdalIdHelper.getAdalVersion()}', ` +
            `file version '${AdalIdHelper_1.AdalIdHelper.getAssemblyFileVersion()}' and ` +
            `informational version '${AdalIdHelper_1.AdalIdHelper.getAssemblyInformationalVersion()}' is running...`;
        this.callState.logger.info(msg);
        msg = "=== Token Acquisition started: \n\t" +
            `Authentication Target: ${TokenCacheKey_1.TokenSubjectType[requestData.subjectType]}\n\t`;
        if (InstanceDiscovery_1.InstanceDiscovery.isWhitelisted(requestData.authenticator.getAuthorityHost())) {
            msg += `, Authority Host: ${requestData.authenticator.getAuthorityHost()}`;
        }
        this.callState.logger.info(msg);
        const piiMsg = `=== Token Acquisition started:\n\t` +
            `Authority: ${requestData.authenticator.authority}\n\t` +
            `Resource: ${requestData.resource}\n\t` +
            `ClientId: ${requestData.clientKey.clientId}\n\t` +
            `CacheType: ? ${this.tokenCache ? ` (${this.tokenCache.count} items)` : "null"}\n\t` +
            `Authentication Target: ${TokenCacheKey_1.TokenSubjectType[requestData.subjectType]}\n\t`;
        this.callState.logger.infoPii(piiMsg);
    }
    static createCallState(correlationId, logger) {
        correlationId = (correlationId && correlationId !== Utils_1.Utils.guidEmpty) ? correlationId : Utils_1.Utils.newGuid();
        logger = logger ? logger : new ConsoleLogger_1.ConsoleLogger(correlationId);
        return new CallState_1.CallState(correlationId, logger);
    }
    async runAsync() {
        let notifiedBeforeAccessCache = false;
        let extendedLifetimeResultEx = null;
        try {
            await this.preRunAsync();
            if (this.loadFromCache) {
                this.callState.logger.verbose("Loading from cache.");
                this.cacheQueryData.authority = this.authenticator.authority;
                this.cacheQueryData.resource = this.resource;
                this.cacheQueryData.clientId = this.clientKey.clientId;
                this.cacheQueryData.subjectType = this.tokenSubjectType;
                this.cacheQueryData.uniqueId = this.uniqueId;
                this.cacheQueryData.displayableId = this.displayableId;
                this.notifyBeforeAccessCache();
                notifiedBeforeAccessCache = true;
                this.resultEx = await this.tokenCache.loadFromCacheAsync(this.cacheQueryData, this.callState);
                extendedLifetimeResultEx = this.resultEx;
                if (this.resultEx && this.resultEx.result && ((!this.resultEx.result.accessToken && this.resultEx.refreshToken) ||
                    (this.resultEx.result.extendedLifeTimeToken && this.resultEx.refreshToken))) {
                    this.resultEx = await this.refreshAccessTokenAsync(this.resultEx);
                    if (this.resultEx && !this.resultEx.error) {
                        notifiedBeforeAccessCache = await this.storeResultExToCacheAsync(notifiedBeforeAccessCache);
                    }
                }
            }
            if (!this.resultEx || this.resultEx.error) {
                await this.preTokenRequestAsync();
                this.resultEx = await this.sendTokenRequestAsync();
                if (this.resultEx && this.resultEx.error) {
                    throw this.resultEx.error;
                }
                await this.postTokenRequestAsync(this.resultEx);
                notifiedBeforeAccessCache = await this.storeResultExToCacheAsync(notifiedBeforeAccessCache);
            }
            await this.postRunAsync(this.resultEx.result);
            return this.resultEx.result;
        }
        catch (error) {
            this.callState.logger.errorExPii(error);
            if (this.client && this.client.resiliency && extendedLifetimeResultEx) {
                const msg = "Refreshing AT failed either due to one of these :- Internal Server Error," +
                    "Gateway Timeout and Service Unavailable. " +
                    "Hence returning back stale AT";
                this.callState.logger.info(msg);
                return extendedLifetimeResultEx.result;
            }
            throw error;
        }
        finally {
            if (notifiedBeforeAccessCache) {
                this.notifyAfterAccessCache();
            }
        }
    }
    preTokenRequestAsync() {
        return Promise.resolve();
    }
    async updateAuthorityAsync(updatedAuthority) {
        if (this.authenticator.authority !== updatedAuthority) {
            await this.authenticator.updateAuthorityAsync(updatedAuthority, this.callState);
            this.validateAuthorityType();
        }
    }
    async postTokenRequestAsync(resultEx) {
        if (resultEx.result.authority) {
            await this.updateAuthorityAsync(resultEx.result.authority);
        }
        this.authenticator.updateTenantId(resultEx.result.tenantId);
        resultEx.result.authority = this.authenticator.authority;
    }
    postRunAsync(result) {
        this.logReturnedToken(result);
        return Promise.resolve();
    }
    async preRunAsync() {
        await this.authenticator.updateFromTemplateAsync(this.callState);
        this.validateAuthorityType();
    }
    validateAuthorityType() {
        if (!this.supportADFS && this.authenticator.authorityType === Authenticator_1.AuthorityType.ADFS) {
            throw new Error(`Invalid Authority Type Template ${this.authenticator.authority}`);
        }
    }
    async sendTokenRequestAsync() {
        const requestParameters = new RequestParameters_1.DictionaryRequestParameters(this.resource, this.clientKey);
        this.addAdditionalRequestParameters(requestParameters);
        return await this.sendHttpMessageAsync(requestParameters);
    }
    async sendTokenRequestByRefreshTokenAsync(refreshToken) {
        const requestParameters = new RequestParameters_1.DictionaryRequestParameters(this.resource, this.clientKey);
        requestParameters.set(OAuthConstants_1.OAuthParameter.grantType, OAuthConstants_1.OAuthGrantType.refreshToken);
        requestParameters.set(OAuthConstants_1.OAuthParameter.refreshToken, refreshToken);
        requestParameters.set(OAuthConstants_1.OAuthParameter.scope, OAuthConstants_1.OAuthValue.scopeOpenId);
        const result = await this.sendHttpMessageAsync(requestParameters);
        if (result.refreshToken == null) {
            result.refreshToken = refreshToken;
            const msg = "Refresh token was missing from the token refresh response, " +
                "so the refresh token in the request is returned instead";
            this.callState.logger.verbose(msg);
        }
        return result;
    }
    logReturnedToken(result) {
        if (result.accessToken) {
            const accessTokenHash = crypto
                .createHash("sha256")
                .update(result.accessToken, "utf8")
                .digest("hex");
            const msg = `=== Token Acquisition finished successfully. An access token was returned: Expiration Time: ${result.expiresOn}`;
            this.callState.logger.info(msg);
            const userId = result.userInfo != null ? result.userInfo.uniqueId : "null";
            const piiMsg = msg + ` Access Token Hash: ${accessTokenHash}\n\t User id: ${userId}`;
            this.callState.logger.infoPii(piiMsg);
        }
    }
    async sendHttpMessageAsync(requestParameters) {
        this.client = new AdalHttpClient_1.AdalHttpClient(this.authenticator.tokenUri, this.callState);
        this.client.client.bodyParameters = requestParameters;
        const jsonResponse = await this.client.getResponseAsync();
        const tokenResponse = TokenResponse_1.TokenResponse.fromJson(jsonResponse);
        return tokenResponse.getResult(this.callState);
    }
    async storeResultExToCacheAsync(notifiedBeforeAccessCache) {
        if (this.storeToCache) {
            if (!notifiedBeforeAccessCache) {
                this.notifyBeforeAccessCache();
                notifiedBeforeAccessCache = true;
            }
            await this.tokenCache.storeToCacheAsync(this.resultEx, this.authenticator.authority, this.resource, this.clientKey.clientId, this.tokenSubjectType, this.callState);
        }
        return notifiedBeforeAccessCache;
    }
    async refreshAccessTokenAsync(result) {
        let newResultEx = null;
        if (this.resource) {
            const msg = "Refreshing access token...";
            this.callState.logger.verbose(msg);
            try {
                newResultEx = await this.sendTokenRequestByRefreshTokenAsync(result.refreshToken);
                this.authenticator.updateTenantId(result.result.tenantId);
                newResultEx.result.authority = this.authenticator.authority;
                if (!newResultEx.result.idToken) {
                    newResultEx.result.updateTenantAndUserInfo(result.result.tenantId, result.result.idToken, result.result.userInfo);
                }
            }
            catch (error) {
                if (!(error instanceof AdalServiceError_1.AdalServiceError)) {
                    throw error;
                }
                const serviceError = error;
                if (serviceError && serviceError.errorCode === "invalid_request") {
                    throw new AdalServiceError_1.AdalServiceError(AdalErrorCode_1.AdalErrorCode.failedToRefreshToken, Constants_1.AdalErrorMessage.failedToRefreshToken + ". " + serviceError.message, serviceError.serviceErrorCodes, serviceError);
                }
                newResultEx = new AuthenticationResultEx_1.AuthenticationResultEx();
                newResultEx.error = error;
            }
        }
        return newResultEx;
    }
    notifyBeforeAccessCache() {
        const args = new TokenCacheNotificationArgs_1.TokenCacheNotificationArgs();
        args.tokenCache = this.tokenCache;
        args.resource = this.resource;
        args.clientId = this.clientKey.clientId;
        args.uniqueId = this.uniqueId;
        args.displayableId = this.displayableId;
        this.tokenCache.onBeforeAccess(args);
    }
    notifyAfterAccessCache() {
        const args = new TokenCacheNotificationArgs_1.TokenCacheNotificationArgs();
        args.tokenCache = this.tokenCache;
        args.resource = this.resource;
        args.clientId = this.clientKey.clientId;
        args.uniqueId = this.uniqueId;
        args.displayableId = this.displayableId;
        this.tokenCache.onAfterAccess(args);
    }
}
AcquireTokenHandlerBase.nullResource = "null_resource_as_optional";
exports.AcquireTokenHandlerBase = AcquireTokenHandlerBase;
//# sourceMappingURL=AcquireTokenHandlerBase.js.map