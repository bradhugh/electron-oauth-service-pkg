"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdalErrorCode_1 = require("../AdalErrorCode");
const AdalServiceError_1 = require("../AdalServiceError");
const AuthenticationResultEx_1 = require("../AuthenticationResultEx");
const Constants_1 = require("../Constants");
const Authenticator_1 = require("../instance/Authenticator");
const InstanceDiscovery_1 = require("../instance/InstanceDiscovery");
const TokenCacheKey_1 = require("../internal/cache/TokenCacheKey");
const CallState_1 = require("../internal/CallState");
const AdalHttpClient_1 = require("../internal/http/AdalHttpClient");
const OAuthConstants_1 = require("../internal/oauth2/OAuthConstants");
const RequestParameters_1 = require("../internal/RequestParameters");
const TokenCacheNotificationArgs_1 = require("../TokenCacheNotificationArgs");
const Utils_1 = require("../Utils");
const BrokerParameter_1 = require("./BrokerParameter");
class ClientKey {
    constructor(clientId) {
        this.clientId = clientId;
    }
    addToParameters(parameters) {
        if (this.clientId) {
            parameters.set(OAuthConstants_1.OAuthParameter.clientId, this.clientId);
        }
    }
}
exports.ClientKey = ClientKey;
class AcquireTokenHandlerBase {
    constructor(requestData) {
        this.loadFromCache = false;
        this.storeToCache = false;
        this.brokerParameters = null;
        this.cacheQueryData = null;
        this.client = null;
        this.authenticator = requestData.authenticator;
        this.callState = AcquireTokenHandlerBase.createCallState(requestData.correlationId !== Utils_1.Utils.guidEmpty
            ? requestData.correlationId
            : this.authenticator.correlationId);
        this.tokenCache = requestData.tokenCache;
        if (!requestData.resource) {
            throw new Error("requestData.resource must be set");
        }
        this.resource = requestData.resource !== AcquireTokenHandlerBase.nullResource ? requestData.resource : null;
        this.clientKey = requestData.clientKey;
        this.tokenSubjectType = requestData.subjectType;
        this.loadFromCache = !!this.tokenCache;
        this.storeToCache = !!this.tokenCache;
        this.supportAdfs = false;
        this.brokerParameters = {};
        this.brokerParameters[BrokerParameter_1.BrokerParameter.authority] = requestData.authenticator.authority;
        this.brokerParameters[BrokerParameter_1.BrokerParameter.resource] = requestData.resource;
        this.brokerParameters[BrokerParameter_1.BrokerParameter.clientId] = requestData.clientKey.clientId;
        this.brokerParameters[BrokerParameter_1.BrokerParameter.correlationId] = this.callState.correlationId;
        this.brokerParameters[BrokerParameter_1.BrokerParameter.clientVersion] = "3";
        this.resultEx = null;
        this.cacheQueryData.extendedLifeTimeEnabled = requestData.extendedLifeTimeEnabled;
        this.callState.logger.info("EOAS is running...");
        let msg = "=== Token Acquisition started: \n\t" +
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
    static createCallState(correlationId) {
        correlationId = (correlationId !== Utils_1.Utils.guidEmpty) ? correlationId : Utils_1.Utils.newGuid();
        return new CallState_1.CallState(correlationId);
    }
    runAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            let notifiedBeforeAccessCache = false;
            let extendedLifetimeResultEx = null;
            try {
                yield this.preRunAsync();
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
                    this.resultEx = yield this.tokenCache.loadFromCacheAsync(this.cacheQueryData, this.callState);
                    extendedLifetimeResultEx = this.resultEx;
                    if (this.resultEx && this.resultEx.result &&
                        ((!this.resultEx.result.accessToken && !this.resultEx.refreshToken) ||
                            (this.resultEx.result.extendedLifeTimeToken && this.resultEx.refreshToken))) {
                        this.resultEx = yield this.refreshAccessTokenAsync(this.resultEx);
                        if (this.resultEx && !this.resultEx.error) {
                            notifiedBeforeAccessCache = yield this.storeResultExToCacheAsync(notifiedBeforeAccessCache);
                        }
                    }
                }
                if (!this.resultEx || this.resultEx.error) {
                }
            }
            catch (error) {
                this.callState.logger.errorExPii(error);
                if (this.client != null && this.client.resiliency && extendedLifetimeResultEx != null) {
                    const msg = "Refreshing AT failed either due to one of these :- Internal Server Error," +
                        "Gateway Timeout and Service Unavailable. " +
                        "Hence returning back stale AT";
                    this.callState.logger.info(msg);
                    return extendedLifetimeResultEx.result;
                }
            }
            finally {
                if (notifiedBeforeAccessCache) {
                    this.notifyAfterAccessCache();
                }
            }
        });
    }
    preRunAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.authenticator.updateFromTemplateAsync(this.callState);
            this.validateAuthorityType();
        });
    }
    validateAuthorityType() {
        if (!this.supportAdfs && this.authenticator.authorityType === Authenticator_1.AuthorityType.ADFS) {
            throw new Error(`Invalid Authority Type Template ${this.authenticator.authority}`);
        }
    }
    sendTokenRequestByRefreshTokenAsync(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const requestParameters = new RequestParameters_1.DictionaryRequestParameters(this.resource, this.clientKey);
            requestParameters.set(OAuthConstants_1.OAuthParameter.grantType, OAuthConstants_1.OAuthGrantType.refreshToken);
            requestParameters.set(OAuthConstants_1.OAuthParameter.refreshToken, refreshToken);
            requestParameters.set(OAuthConstants_1.OAuthParameter.scope, OAuthConstants_1.OAuthValue.scopeOpenId);
            const result = yield this.sendHttpMessageAsync(requestParameters);
            if (result.refreshToken == null) {
                result.refreshToken = refreshToken;
                const msg = "Refresh token was missing from the token refresh response, " +
                    "so the refresh token in the request is returned instead";
                this.callState.logger.verbose(msg);
            }
            return result;
        });
    }
    sendHttpMessageAsync(requestParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = new AdalHttpClient_1.AdalHttpClient(this.authenticator.tokenUri, this.callState);
            this.client.client.bodyParameters = requestParameters;
            const tokenResponse = yield this.client.getResponseAsync();
            return tokenResponse.getResult();
        });
    }
    storeResultExToCacheAsync(notifiedBeforeAccessCache) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.storeToCache) {
                if (!notifiedBeforeAccessCache) {
                    this.notifyBeforeAccessCache();
                    notifiedBeforeAccessCache = true;
                }
                yield this.tokenCache.storeToCacheAsync(this.resultEx, this.authenticator.authority, this.resource, this.clientKey.clientId, this.tokenSubjectType, this.callState);
            }
            return notifiedBeforeAccessCache;
        });
    }
    refreshAccessTokenAsync(result) {
        return __awaiter(this, void 0, void 0, function* () {
            let newResultEx = null;
            if (this.resource) {
                const msg = "Refreshing access token...";
                this.callState.logger.verbose(msg);
                try {
                    newResultEx = yield this.sendTokenRequestByRefreshTokenAsync(result.refreshToken);
                    this.authenticator.updateTenantId(result.result.tenantId);
                    newResultEx.result.authority = this.authenticator.authority;
                    if (!newResultEx.result.idToken) {
                        newResultEx.result.updateTenantAndUserInfo(result.result.tenantId, result.result.idToken, result.result.userInfo);
                    }
                }
                catch (error) {
                    const serviceError = error;
                    if (serviceError && serviceError.errorCode === "invalid_request") {
                        throw new AdalServiceError_1.AdalServiceError(AdalErrorCode_1.AdalErrorCode.failedToRefreshToken, Constants_1.AdalErrorMessage.failedToRefreshToken + ". " + serviceError.message, serviceError.serviceErrorCodes, serviceError);
                    }
                    newResultEx = new AuthenticationResultEx_1.AuthenticationResultEx();
                    newResultEx.error = error;
                }
            }
            return newResultEx;
        });
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