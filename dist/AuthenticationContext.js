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
const Utils_1 = require("./Utils");
const TokenCache_1 = require("./cache/TokenCache");
class UserInfo {
}
exports.UserInfo = UserInfo;
class AuthenticationResult {
    constructor(accessTokenType, accessToken, expiresOn, extendedExpiresOn) {
        this.accessTokenType = accessTokenType;
        this.accessToken = accessToken;
        this.expiresOn = expiresOn;
        if (extendedExpiresOn) {
            this.extendedExpiresOn = extendedExpiresOn;
        }
        else {
            this.extendedExpiresOn = expiresOn;
        }
    }
}
exports.AuthenticationResult = AuthenticationResult;
class AuthenticationContext {
    constructor(authority, authorizeUrl, accessTokenUrl, redirectUri) {
        this.authority = authority;
        this.authorizeUrl = authorizeUrl;
        this.accessTokenUrl = accessTokenUrl;
        this.redirectUri = redirectUri;
        this.tokenCache = new TokenCache_1.TokenCache();
    }
    acquireTokenAsync(tenant, resource, scope = "user_impersonation", clientId, redirectUri = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!redirectUri) {
                redirectUri = this.redirectUri;
            }
            let result = this.tokenCache.loadFromCache({
                authority: this.authority,
                resource: resource,
                clientId: clientId,
                subjectType: TokenCache_1.TokenSubjectType.Client,
                extendedLifeTimeEnabled: false,
            });
            if (result && result.result && result.result.accessToken) {
                return result.result;
            }
            if (result && result.refreshToken) {
                result = yield Utils_1.Utils.refreshAccessTokenAsync(this.accessTokenUrl, this.authority, resource, clientId, result, this.tokenCache);
                if (result && result.result && result.result.accessToken) {
                    return result.result;
                }
            }
            result = yield Utils_1.Utils.getAuthTokenInteractiveAsync(this.authority, this.authorizeUrl, this.accessTokenUrl, clientId, redirectUri, tenant, resource, scope, this.tokenCache);
            return result.result;
        });
    }
}
exports.AuthenticationContext = AuthenticationContext;
//# sourceMappingURL=AuthenticationContext.js.map