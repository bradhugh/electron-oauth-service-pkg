"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalError_1 = require("../../AdalError");
const AdalErrorCode_1 = require("../../AdalErrorCode");
const AdalServiceError_1 = require("../../AdalServiceError");
const AdalUserMismatchException_1 = require("../../AdalUserMismatchException");
const Constants_1 = require("../../Constants");
const AcquireTokenHandlerBase_1 = require("../../flows/AcquireTokenHandlerBase");
const BrokerParameter_1 = require("../../flows/BrokerParameter");
const EncodingHelper_1 = require("../../helpers/EncodingHelper");
const UserIdentifier_1 = require("../../UserIdentifier");
const Utils_1 = require("../../Utils");
const AuthorizationResult_1 = require("../AuthorizationResult");
const AdalIdHelper_1 = require("../helpers/AdalIdHelper");
const OAuthConstants_1 = require("../oauth2/OAuthConstants");
const RequestParameters_1 = require("../RequestParameters");
class AcquireTokenInteractiveHandler extends AcquireTokenHandlerBase_1.AcquireTokenHandlerBase {
    static replaceHost(original, newHost) {
        const ub = new URL(original);
        ub.host = newHost;
        return ub.href;
    }
    constructor(requestData, redirectUri, parameters, userId, extraQueryParameters, webUI, claims, logger) {
        super(requestData, logger);
        this.redirectUri = this.platformInformation.validateRedirectUri(redirectUri, this.callState);
        if (this.redirectUri.hash) {
            throw new Error(Constants_1.AdalErrorMessage.redirectUriContainsFragment);
        }
        this.authorizationParameters = parameters;
        this.redirectUriRequestParameter =
            this.platformInformation.getRedirectUriAsString(this.redirectUri, this.callState);
        if (userId == null) {
            throw new Error(Constants_1.AdalErrorMessage.specifyAnyUser);
        }
        this.userId = userId;
        if (extraQueryParameters && extraQueryParameters[0] === "&") {
            extraQueryParameters = extraQueryParameters.substring(1);
        }
        this.extraQueryParameters = extraQueryParameters;
        this.webUi = webUI;
        this.uniqueId = userId.uniqueId;
        this.displayableId = userId.displayableId;
        this.userIdentifierType = userId.type;
        this.supportADFS = true;
        if (claims) {
            this.loadFromCache = false;
            const msg = "Claims present. Skip cache lookup.";
            this.callState.logger.verbose(msg);
            this.claims = claims;
            this.brokerParameters.set(BrokerParameter_1.BrokerParameter.claims, claims);
        }
        else {
            this.loadFromCache = (requestData.tokenCache
                && parameters
                && this.platformInformation.getCacheLoadPolicy(parameters));
        }
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.force, "NO");
        if (userId !== UserIdentifier_1.UserIdentifier.anyUser) {
            this.brokerParameters.set(BrokerParameter_1.BrokerParameter.username, userId.id);
        }
        else {
            this.brokerParameters.set(BrokerParameter_1.BrokerParameter.username, "");
        }
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.usernameType, UserIdentifier_1.UserIdentifierType[userId.type]);
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.redirectUri, this.redirectUri.href);
        this.brokerParameters.set(BrokerParameter_1.BrokerParameter.extraQp, extraQueryParameters);
    }
    async AcquireAuthorizationAsync() {
        const authorizationUri = this.createAuthorizationUri();
        this.authorizationResult = await this.webUi.acquireAuthorizationAsync(authorizationUri, this.redirectUri, this.callState);
    }
    async createAuthorizationUriAsync(correlationId) {
        this.callState.correlationId = correlationId;
        await this.authenticator.updateFromTemplateAsync(this.callState);
        return this.createAuthorizationUri();
    }
    async preTokenRequestAsync() {
        await super.preTokenRequestAsync();
        await this.AcquireAuthorizationAsync();
        this.verifyAuthorizationResult();
        if (this.authorizationResult.cloudInstanceHost) {
            const updatedAuthority = AcquireTokenInteractiveHandler.replaceHost(this.authenticator.authority, this.authorizationResult.cloudInstanceHost);
            await this.updateAuthorityAsync(updatedAuthority);
        }
    }
    addAdditionalRequestParameters(requestParameters) {
        requestParameters.set(OAuthConstants_1.OAuthParameter.grantType, OAuthConstants_1.OAuthGrantType.authorizationCode);
        requestParameters.set(OAuthConstants_1.OAuthParameter.code, this.authorizationResult.code);
        requestParameters.set(OAuthConstants_1.OAuthParameter.redirectUri, this.redirectUriRequestParameter);
    }
    async postTokenRequestAsync(resultEx) {
        await super.postTokenRequestAsync(resultEx);
        if ((!this.displayableId && !this.uniqueId)
            || this.userIdentifierType === UserIdentifier_1.UserIdentifierType.OptionalDisplayableId) {
            return;
        }
        const uniqueId = (resultEx.result.userInfo && resultEx.result.userInfo.uniqueId) ?
            resultEx.result.userInfo.uniqueId : "NULL";
        const displayableId = resultEx.result.userInfo ? resultEx.result.userInfo.displayableId : "NULL";
        if (this.userIdentifierType === UserIdentifier_1.UserIdentifierType.UniqueId
            && uniqueId !== this.uniqueId) {
            throw new AdalUserMismatchException_1.AdalUserMismatchError(this.uniqueId, uniqueId);
        }
        if (this.userIdentifierType === UserIdentifier_1.UserIdentifierType.RequiredDisplayableId
            && displayableId !== this.displayableId) {
            throw new AdalUserMismatchException_1.AdalUserMismatchError(this.displayableId, displayableId);
        }
    }
    updateBrokerParameters(parameters) {
        const uri = new URL(this.authorizationResult.code);
        const query = EncodingHelper_1.EncodingHelper.urlDecode(uri.search);
        const kvps = EncodingHelper_1.EncodingHelper.parseKeyValueList(query, "&", false, false, this.callState, false);
        parameters.set("username", kvps.get("username"));
    }
    brokerInvocationRequired() {
        if (this.authorizationResult
            && this.authorizationResult.code
            && this.authorizationResult.code.toLowerCase().startsWith("msauth://")) {
            this.brokerParameters.set(BrokerParameter_1.BrokerParameter.brokerInstallUrl, this.authorizationResult.code);
            return true;
        }
        return false;
    }
    createAuthorizationUri() {
        let loginHint = null;
        if (!this.userId.isAnyUser
            && (this.userId.type === UserIdentifier_1.UserIdentifierType.OptionalDisplayableId
                || this.userId.type === UserIdentifier_1.UserIdentifierType.RequiredDisplayableId)) {
            loginHint = this.userId.id;
        }
        const requestParameters = this.createAuthorizationRequest(loginHint);
        const url = new URL(this.authenticator.authorizationUri);
        url.search = requestParameters.toString();
        return url;
    }
    createAuthorizationRequest(loginHint) {
        const authorizationRequestParameters = new RequestParameters_1.DictionaryRequestParameters(this.resource, this.clientKey);
        authorizationRequestParameters.set(OAuthConstants_1.OAuthParameter.responseType, OAuthConstants_1.OAuthResponseType.code);
        authorizationRequestParameters.set(OAuthConstants_1.OAuthParameter.hasChrome, "1");
        authorizationRequestParameters.set(OAuthConstants_1.OAuthParameter.redirectUri, this.redirectUriRequestParameter);
        if (loginHint) {
            authorizationRequestParameters.set(OAuthConstants_1.OAuthParameter.loginHint, loginHint);
        }
        if (this.claims) {
            authorizationRequestParameters.set("claims", this.claims);
        }
        if (this.callState && this.callState.correlationId && this.callState.correlationId !== Utils_1.Utils.guidEmpty) {
            authorizationRequestParameters.set(OAuthConstants_1.OAuthParameter.correlationId, this.callState.correlationId);
        }
        if (this.authorizationParameters != null) {
            this.platformInformation.addPromptBehaviorQueryParameter(this.authorizationParameters, authorizationRequestParameters);
        }
        const adalIdParameters = AdalIdHelper_1.AdalIdHelper.getAdalIdParameters();
        for (const kvp of adalIdParameters) {
            authorizationRequestParameters.set(kvp["0"], kvp["1"]);
        }
        if (this.extraQueryParameters) {
            const kvps = EncodingHelper_1.EncodingHelper.parseKeyValueList(this.extraQueryParameters, "&", false, false, this.callState, false);
            for (const kvp of kvps) {
                if (authorizationRequestParameters.has(kvp["0"])) {
                    throw new AdalError_1.AdalError(AdalErrorCode_1.AdalErrorCode.duplicateQueryParameter, Constants_1.AdalErrorMessage.duplicateQueryParameter(kvp["0"]), null);
                }
            }
            authorizationRequestParameters.extraQueryParameter = this.extraQueryParameters;
        }
        return authorizationRequestParameters;
    }
    verifyAuthorizationResult() {
        if (this.authorizationResult.error === OAuthConstants_1.OAuthError.loginRequired) {
            throw new AdalError_1.AdalError(AdalErrorCode_1.AdalErrorCode.userInteractionRequired, null, null);
        }
        if (this.authorizationResult.status !== AuthorizationResult_1.AuthorizationStatus.Success) {
            throw new AdalServiceError_1.AdalServiceError(this.authorizationResult.error, this.authorizationResult.errorDescription, null, null);
        }
    }
}
exports.AcquireTokenInteractiveHandler = AcquireTokenInteractiveHandler;
//# sourceMappingURL=AcquireTokenInteractiveHandler.js.map