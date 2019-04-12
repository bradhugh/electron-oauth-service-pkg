"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationResult_1 = require("./AuthenticationResult");
const Authenticator_1 = require("./instance/Authenticator");
const TokenCacheKey_1 = require("./internal/cache/TokenCacheKey");
const CallState_1 = require("./internal/CallState");
const ClientKey_1 = require("./internal/clientcreds/ClientKey");
const AcquireTokenInteractiveHandler_1 = require("./internal/flows/AcquireTokenInteractiveHandler");
const WebUIFactoryProvider_1 = require("./internal/platform/WebUIFactoryProvider");
const TokenCache_1 = require("./TokenCache");
const UserIdentifier_1 = require("./UserIdentifier");
const Utils_1 = require("./Utils");
var AuthorityValidationType;
(function (AuthorityValidationType) {
    AuthorityValidationType[AuthorityValidationType["True"] = 0] = "True";
    AuthorityValidationType[AuthorityValidationType["False"] = 1] = "False";
    AuthorityValidationType[AuthorityValidationType["NotProvided"] = 2] = "NotProvided";
})(AuthorityValidationType = exports.AuthorityValidationType || (exports.AuthorityValidationType = {}));
class AuthenticationContext {
    constructor(authority, validateAuthority = AuthorityValidationType.NotProvided, tokenCache = TokenCache_1.TokenCache.defaultShared) {
        this.authority = authority;
        this.tokenCache = tokenCache;
        this.extendedLifeTimeEnabled = false;
        this.callState = new CallState_1.CallState(Utils_1.Utils.guidEmpty);
        this.authenticator = new Authenticator_1.Authenticator(authority, (validateAuthority !== AuthorityValidationType.False));
    }
    getCachedResult(resource, clientId) {
        const exResult = this.tokenCache.loadFromCacheAsync({
            authority: this.authority,
            resource,
            clientId,
            subjectType: TokenCacheKey_1.TokenSubjectType.Client,
            extendedLifeTimeEnabled: false,
        }, this.callState);
        if (exResult) {
            return exResult.result;
        }
        return new AuthenticationResult_1.AuthenticationResult(null, null, null);
    }
    async acquireTokenAsync(resource, clientId, redirectUri, parameters, userId, extraQueryParameters) {
        userId = new UserIdentifier_1.UserIdentifier(userId.id, userId.type);
        const result = await this.acquireTokenCommonAsync(resource, clientId, redirectUri, parameters, userId, extraQueryParameters);
        return result;
    }
    clearCache() {
        this.tokenCache.clear();
    }
    async acquireTokenCommonAsync(resource, clientId, redirectUri, parameters, userId, extraQueryParameters = null, claims = null) {
        const correlationId = Utils_1.Utils.newGuid();
        const requestData = {
            authenticator: this.authenticator,
            tokenCache: this.tokenCache,
            resource,
            clientKey: new ClientKey_1.ClientKey(clientId),
            extendedLifeTimeEnabled: this.extendedLifeTimeEnabled,
            subjectType: TokenCacheKey_1.TokenSubjectType.User,
            correlationId,
        };
        const handler = new AcquireTokenInteractiveHandler_1.AcquireTokenInteractiveHandler(requestData, new URL(redirectUri), parameters, userId, extraQueryParameters, this.createWebAuthenticationDialog(parameters), claims);
        const result = await handler.runAsync();
        return result;
    }
    createWebAuthenticationDialog(parameters) {
        return WebUIFactoryProvider_1.WebUIFactoryProvider.webUIFactory.createAuthenticationDialog(parameters);
    }
}
exports.AuthenticationContext = AuthenticationContext;
//# sourceMappingURL=AuthenticationContext.js.map