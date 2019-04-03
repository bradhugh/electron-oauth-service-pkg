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
const AuthenticationResult_1 = require("./AuthenticationResult");
const TokenCacheKey_1 = require("./internal/cache/TokenCacheKey");
const TokenCache_1 = require("./TokenCache");
const Utils_1 = require("./Utils");
class AuthenticationContext {
    constructor(authority, authorizeUrl, accessTokenUrl, redirectUri) {
        this.authority = authority;
        this.authorizeUrl = authorizeUrl;
        this.accessTokenUrl = accessTokenUrl;
        this.redirectUri = redirectUri;
        this.tokenCache = new TokenCache_1.TokenCache();
    }
    acquireTokenSilentAsync(tenant, resource, scope, clientId, redirectUri = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.acquireTokenAsync(tenant, resource, scope, clientId, redirectUri, true);
        });
    }
    getCachedResult(resource, clientId) {
        const exResult = this.tokenCache.loadFromCache({
            authority: this.authority,
            resource,
            clientId,
            subjectType: TokenCacheKey_1.TokenSubjectType.Client,
            extendedLifeTimeEnabled: false,
        });
        if (exResult) {
            return exResult.result;
        }
        return new AuthenticationResult_1.AuthenticationResult(null, null, null);
    }
    acquireTokenAsync(tenant, resource, scope = "user_impersonation", clientId, redirectUri = null, silent = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!redirectUri) {
                redirectUri = this.redirectUri;
            }
            let result = this.tokenCache.loadFromCache({
                authority: this.authority,
                resource,
                clientId,
                subjectType: TokenCacheKey_1.TokenSubjectType.Client,
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
            if (silent) {
                return result.result;
            }
            result = yield Utils_1.Utils.getAuthTokenInteractiveAsync(this.authority, this.authorizeUrl, this.accessTokenUrl, clientId, redirectUri, tenant, resource, scope, this.tokenCache);
            return result.result;
        });
    }
    clearCache() {
        this.tokenCache.clear();
    }
}
exports.AuthenticationContext = AuthenticationContext;
//# sourceMappingURL=AuthenticationContext.js.map