"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TokenCacheItem_1 = require("./TokenCacheItem");
const AuthenticationResult_1 = require("../AuthenticationResult");
const TokenCacheKey_1 = require("./TokenCacheKey");
const events_1 = require("events");
class TokenCacheNotificationArgs {
}
exports.TokenCacheNotificationArgs = TokenCacheNotificationArgs;
var TokenSubjectType;
(function (TokenSubjectType) {
    TokenSubjectType[TokenSubjectType["User"] = 0] = "User";
    TokenSubjectType[TokenSubjectType["Client"] = 1] = "Client";
    TokenSubjectType[TokenSubjectType["UserPlusClient"] = 2] = "UserPlusClient";
})(TokenSubjectType = exports.TokenSubjectType || (exports.TokenSubjectType = {}));
class TokenCache extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.tokenCacheDictionary = {};
        this._hasStateChanged = false;
    }
    get hasStateChanged() {
        return this._hasStateChanged;
    }
    set hasStateChanged(value) {
        this._hasStateChanged = value;
    }
    readItems() {
        const args = new TokenCacheNotificationArgs();
        args.tokenCache = this;
        this.emit('beforeAccess', args);
        const result = [];
        const keys = Object.keys(this.tokenCacheDictionary);
        for (let key of keys) {
            const entry = this.tokenCacheDictionary[key];
            const item = new TokenCacheItem_1.TokenCacheItem(TokenCacheKey_1.TokenCacheKey.fromStringKey(key), entry.result);
            result.push(item);
        }
        this.emit('afterAccess', args);
        return result;
    }
    clear() {
        const args = new TokenCacheNotificationArgs();
        args.tokenCache = this;
        this.emit("beforeAccess", args);
        this.emit("beforeWrite", args);
        this.tokenCacheDictionary = {};
    }
    storeToCache(result, authority, resource, clientId, subjectType) {
        const uniqueId = result.result.userInfo ? result.result.userInfo.uniqueId : null;
        const displayableId = result.result.userInfo ? result.result.userInfo.displayableId : null;
        const args = new TokenCacheNotificationArgs();
        args.resource = resource;
        args.clientId = clientId;
        args.uniqueId = uniqueId;
        args.displayableId = displayableId;
        this.emit("beforeWrite", args);
        const key = new TokenCacheKey_1.TokenCacheKey(authority, resource, clientId, subjectType, uniqueId, displayableId);
        const stringKey = key.getStringKey();
        this.tokenCacheDictionary[stringKey] = result;
        this.hasStateChanged = true;
    }
    loadFromCache(cacheQueryData) {
        let result = null;
        const kvp = this.loadSingleItemFromCache(cacheQueryData);
        if (kvp) {
            const key = kvp.key;
            result = kvp.value.clone();
            const now = new Date();
            const expiredByExpiresOn = result.result.expiresOn.getTime() <= now.getTime() + (1000 * 60 * 5);
            const expiredByExpiresOnExtended = result.result.extendedExpiresOn.getTime() <= now.getTime();
            if (key.authority !== cacheQueryData.authority) {
                result.result.accessToken = null;
            }
            else if (expiredByExpiresOn && !cacheQueryData.extendedLifeTimeEnabled) {
                result.result.accessToken = null;
            }
            else if (!key.resourceEquals(cacheQueryData.resource)) {
                const tempResult = new AuthenticationResult_1.AuthenticationResultEx();
                tempResult.result = new AuthenticationResult_1.AuthenticationResult(null, null, new Date(-8640000000000000));
                tempResult.refreshToken = result.refreshToken;
                tempResult.resourceInResponse = result.resourceInResponse;
                tempResult.result.updateTenantAndUserInfo(result.result.tenantId, result.result.idToken, result.result.userInfo);
                result = tempResult;
            }
            else if ((!expiredByExpiresOnExtended && cacheQueryData.extendedLifeTimeEnabled) && expiredByExpiresOn) {
                result.result.extendedLifeTimeToken = true;
                result.result.expiresOn = result.result.extendedExpiresOn;
            }
            else if (expiredByExpiresOnExtended) {
                result.result.accessToken = null;
            }
            else {
                const millisecondsLeft = result.result.expiresOn.getTime() - now.getTime();
                const minutesLeft = millisecondsLeft / 1000 / 60;
                console.log(`${minutesLeft.toFixed(2)} minutes left until token in cache expires`);
            }
            if (!result.result.accessToken && !result.refreshToken) {
                delete this.tokenCacheDictionary[key.getStringKey()];
                this.hasStateChanged = true;
                result = null;
            }
            if (result !== null) {
                result.result.authority = key.authority;
            }
        }
        else {
            console.log(`No matching token was found in the cache`);
        }
        return result;
    }
    queryCache(authority, clientId, subjectType, uniqueId, displayableId) {
        const results = [];
        const keys = Object.keys(this.tokenCacheDictionary);
        for (const key of keys) {
            const entry = this.tokenCacheDictionary[key];
            const cacheKey = TokenCacheKey_1.TokenCacheKey.fromStringKey(key);
            if ((!authority || cacheKey.authority === authority)
                && (!clientId || cacheKey.clientIdEquals(clientId))
                && (!uniqueId || cacheKey.uniqueId === uniqueId)
                && (!displayableId || cacheKey.displayableIdEquals(displayableId))
                && cacheKey.tokenSubjectType === subjectType) {
                results.push({
                    key: cacheKey,
                    value: entry
                });
            }
        }
        return results;
    }
    loadSingleItemFromCache(cacheQueryData) {
        let cacheItems = this.queryCache(cacheQueryData.authority, cacheQueryData.clientId, cacheQueryData.subjectType, cacheQueryData.uniqueId, cacheQueryData.displayableId);
        cacheItems = cacheItems.filter(p => p.key.resourceEquals(cacheQueryData.resource));
        let result = null;
        switch (cacheItems.length) {
            case 1:
                result = cacheItems[0];
                break;
            case 0:
                const multiResourceTokens = cacheItems.filter(p => p.value.isMultipleResourceRefreshToken);
                if (multiResourceTokens.length) {
                    result = multiResourceTokens[0];
                }
                break;
            default:
                throw new Error("Multiple matching tokens detected");
        }
        if (!result && cacheQueryData.subjectType !== TokenSubjectType.Client) {
            const sameCloudEntries = this.queryCache(null, cacheQueryData.clientId, cacheQueryData.subjectType, cacheQueryData.uniqueId, cacheQueryData.displayableId)
                .filter(item => TokenCache.isSameCloud(item.key.authority, cacheQueryData.authority));
            if (sameCloudEntries.length) {
                result = sameCloudEntries[0];
            }
        }
        return result;
    }
    static isSameCloud(authority, authority1) {
        return new URL(authority).host === new URL(authority1).host;
    }
}
exports.TokenCache = TokenCache;
//# sourceMappingURL=TokenCache.js.map