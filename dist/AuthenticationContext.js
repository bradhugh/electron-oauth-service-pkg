"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ConsoleLogger_1 = require("./core/ConsoleLogger");
const Authenticator_1 = require("./instance/Authenticator");
const TokenCacheKey_1 = require("./internal/cache/TokenCacheKey");
const ClientKey_1 = require("./internal/clientcreds/ClientKey");
const AcquireTokenInteractiveHandler_1 = require("./internal/flows/AcquireTokenInteractiveHandler");
const AcquireTokenSilentHandler_1 = require("./internal/flows/AcquireTokenSilentHandler");
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
    constructor(authority, validateAuthority = AuthorityValidationType.NotProvided, tokenCache = TokenCache_1.TokenCache.defaultShared, logger) {
        this.authority = authority;
        this.tokenCache = tokenCache;
        this.logger = logger;
        this.extendedLifeTimeEnabled = false;
        if (!logger) {
            this.logger = new ConsoleLogger_1.ConsoleLogger(Utils_1.Utils.guidEmpty);
        }
        this.authenticator = new Authenticator_1.Authenticator(authority, (validateAuthority !== AuthorityValidationType.False));
    }
    async acquireTokenAsync(resource, clientId, redirectUri, parameters, userId, extraQueryParameters) {
        userId = new UserIdentifier_1.UserIdentifier(userId.id, userId.type);
        const result = await this.acquireTokenCommonAsync(resource, clientId, redirectUri, parameters, userId, extraQueryParameters);
        return result;
    }
    async acquireTokenSilentAsync(resource, clientId, userId, parameters) {
        userId = new UserIdentifier_1.UserIdentifier(userId.id, userId.type);
        return await this.acquireTokenSilentCommonAsync(resource, new ClientKey_1.ClientKey(clientId), userId, parameters);
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
        const handler = new AcquireTokenInteractiveHandler_1.AcquireTokenInteractiveHandler(requestData, new URL(redirectUri), parameters, userId, extraQueryParameters, this.createWebAuthenticationDialog(parameters), claims, this.logger);
        const result = await handler.runAsync();
        return result;
    }
    async acquireTokenSilentCommonAsync(resource, clientKey, userId, parameters) {
        const correlationId = Utils_1.Utils.newGuid();
        const requestData = {
            authenticator: this.authenticator,
            tokenCache: this.tokenCache,
            resource,
            clientKey,
            extendedLifeTimeEnabled: this.extendedLifeTimeEnabled,
            subjectType: TokenCacheKey_1.TokenSubjectType.User,
            correlationId,
        };
        const handler = new AcquireTokenSilentHandler_1.AcquireTokenSilentHandler(requestData, userId, parameters, this.logger);
        const result = await handler.runAsync();
        return result;
    }
    createWebAuthenticationDialog(parameters) {
        return WebUIFactoryProvider_1.WebUIFactoryProvider.webUIFactory.createAuthenticationDialog(parameters);
    }
}
exports.AuthenticationContext = AuthenticationContext;
//# sourceMappingURL=AuthenticationContext.js.map