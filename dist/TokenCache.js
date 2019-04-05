"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const AuthenticationResult_1 = require("./AuthenticationResult");
const AuthenticationResultEx_1 = require("./AuthenticationResultEx");
const AdalLogger_1 = require("./core/AdalLogger");
const TokenCacheKey_1 = require("./internal/cache/TokenCacheKey");
const Pair_1 = require("./Pair");
const TokenCacheNotificationArgs_1 = require("./TokenCacheNotificationArgs");
const Utils_1 = require("./Utils");
class TokenCache extends events_1.EventEmitter {
    constructor(logger, state) {
        super();
        this.logger = logger;
        this.$hasStateChanged = false;
        this.tokenCacheDictionary = new Map();
        if (state) {
            this.deserialize(state);
        }
    }
    static isSameCloud(authority, authority1) {
        return new URL(authority).host === new URL(authority1).host;
    }
    static get defaultShared() {
        return TokenCache.$defaultShared;
    }
    get hasStateChanged() {
        return this.$hasStateChanged;
    }
    set hasStateChanged(value) {
        this.$hasStateChanged = value;
    }
    get count() {
        return this.tokenCacheDictionary.size;
    }
    serialize() {
        const serialized = JSON.stringify(this.tokenCacheDictionary);
        return new Buffer(serialized, "utf8");
    }
    deserialize(state) {
        if (!state) {
            this.tokenCacheDictionary.clear();
            return;
        }
        const serialized = state.toString("utf8");
        this.tokenCacheDictionary = JSON.parse(serialized);
    }
    readItems() {
        const args = new TokenCacheNotificationArgs_1.TokenCacheNotificationArgs();
        args.tokenCache = this;
        this.emit("beforeAccess", args);
        const result = [];
        this.emit("afterAccess", args);
        return result;
    }
    deleteItem(item) {
        const args = new TokenCacheNotificationArgs_1.TokenCacheNotificationArgs();
        args.tokenCache = this;
        args.resource = item.resource;
        args.clientId = item.clientId;
        args.uniqueId = item.uniqueId;
        args.displayableId = item.displayableId;
        this.emit("beforeAccess", args);
        this.emit("beforeWrite", args);
        let toRemoveStringKey = null;
        for (const stringKey of this.tokenCacheDictionary.keys()) {
            const key = TokenCacheKey_1.TokenCacheKey.fromStringKey(stringKey);
            if (item.match(key)) {
                toRemoveStringKey = stringKey;
                break;
            }
        }
        if (toRemoveStringKey) {
            this.tokenCacheDictionary.delete(toRemoveStringKey);
        }
        else {
        }
        this.hasStateChanged = true;
        this.emit("onAfterAccess", args);
    }
    clear() {
        const args = new TokenCacheNotificationArgs_1.TokenCacheNotificationArgs();
        args.tokenCache = this;
        this.emit("beforeAccess", args);
        this.emit("beforeWrite", args);
        this.tokenCacheDictionary.clear();
        this.hasStateChanged = true;
        this.emit("onafterAccess", args);
    }
    storeToCacheAsync(result, authority, resource, clientId, subjectType, callState) {
        const uniqueId = result.result.userInfo ? result.result.userInfo.uniqueId : null;
        const displayableId = result.result.userInfo ? result.result.userInfo.displayableId : null;
        const args = new TokenCacheNotificationArgs_1.TokenCacheNotificationArgs();
        args.resource = resource;
        args.clientId = clientId;
        args.uniqueId = uniqueId;
        args.displayableId = displayableId;
        this.emit("beforeWrite", args);
        const key = new TokenCacheKey_1.TokenCacheKey(authority, resource, clientId, subjectType, uniqueId, displayableId);
        this.tokenCacheDictionary.set(key.toStringKey(), result);
        this.hasStateChanged = true;
    }
    loadFromCacheAsync(cacheQueryData, callState) {
        let resultEx = null;
        const kvp = this.loadSingleItemFromCache(cacheQueryData);
        if (kvp) {
            const key = kvp.key;
            resultEx = kvp.value.clone();
            const now = new Date();
            const tokenNearExpiry = resultEx.result.expiresOn.getTime() <= now.getTime() +
                (1000 * 60 * TokenCache.expirationMarginInMinutes);
            const tokenExtendedLifeTimeExpired = resultEx.result.extendedExpiresOn.getTime() <= now.getTime();
            if (key.authority !== cacheQueryData.authority) {
                resultEx.result.accessToken = null;
                this.logger.info("Cross-tenant refresh token found in the cache");
            }
            else if (tokenNearExpiry && !cacheQueryData.extendedLifeTimeEnabled) {
                resultEx.result.accessToken = null;
                this.logger.info("An expired or near expiry token was found in the cache");
            }
            else if (!key.resourceEquals(cacheQueryData.resource)) {
                const newResultEx = new AuthenticationResultEx_1.AuthenticationResultEx();
                newResultEx.result = new AuthenticationResult_1.AuthenticationResult(null, null, new Date(-8640000000000000));
                newResultEx.refreshToken = resultEx.refreshToken;
                newResultEx.resourceInResponse = resultEx.resourceInResponse;
                newResultEx.result.updateTenantAndUserInfo(resultEx.result.tenantId, resultEx.result.idToken, resultEx.result.userInfo);
                resultEx = newResultEx;
            }
            else if ((!tokenExtendedLifeTimeExpired && cacheQueryData.extendedLifeTimeEnabled) && tokenNearExpiry) {
                resultEx.result.extendedLifeTimeToken = true;
                resultEx.result.expiresOn = resultEx.result.extendedExpiresOn;
                this.logger.info("The extendedLifeTime is enabled and a stale AT with extendedLifeTimeEnabled is returned.");
            }
            else if (tokenExtendedLifeTimeExpired) {
                resultEx.result.accessToken = null;
                this.logger.info("The AT has expired its ExtendedLifeTime");
            }
            else {
                const millisecondsLeft = resultEx.result.expiresOn.getTime() - now.getTime();
                const minutesLeft = millisecondsLeft / 1000 / 60;
                this.logger.info(`${minutesLeft.toFixed(2)} minutes left until token in cache expires`);
            }
            if (!resultEx.result.accessToken && !resultEx.refreshToken) {
                this.tokenCacheDictionary.delete(key.toStringKey());
                this.logger.info("An old item was removed from the cache");
                this.hasStateChanged = true;
                resultEx = null;
            }
            if (resultEx !== null) {
                resultEx.result.authority = key.authority;
                this.logger.info("A matching item (access token or refresh token or both) was found in the cache");
            }
        }
        else {
            this.logger.info(`No matching token was found in the cache`);
        }
        return resultEx;
    }
    onBeforeAccess(args) {
        this.emit("beforeAccess", args);
    }
    onAfterAccess(args) {
        this.emit("afterAccess", args);
    }
    queryCache(authority, clientId, subjectType, uniqueId, displayableId) {
        const results = [];
        for (const stringKey of this.tokenCacheDictionary.keys()) {
            const cacheKey = TokenCacheKey_1.TokenCacheKey.fromStringKey(stringKey);
            if ((!authority || cacheKey.authority === authority)
                && (!clientId || cacheKey.clientIdEquals(clientId))
                && (!uniqueId || cacheKey.uniqueId === uniqueId)
                && (!displayableId || cacheKey.displayableIdEquals(displayableId))
                && cacheKey.tokenSubjectType === subjectType) {
                const authResultEx = this.tokenCacheDictionary.get(stringKey);
                results.push(new Pair_1.Pair(cacheKey, authResultEx));
            }
        }
        return results;
    }
    loadSingleItemFromCache(cacheQueryData) {
        let cacheItems = this.queryCache(cacheQueryData.authority, cacheQueryData.clientId, cacheQueryData.subjectType, cacheQueryData.uniqueId, cacheQueryData.displayableId);
        cacheItems = cacheItems.filter((p) => p.key.resourceEquals(cacheQueryData.resource));
        let result = null;
        switch (cacheItems.length) {
            case 1:
                result = cacheItems[0];
                break;
            case 0:
                const multiResourceTokens = cacheItems.filter((p) => p.value.isMultipleResourceRefreshToken);
                if (multiResourceTokens.length) {
                    result = multiResourceTokens[0];
                }
                break;
            default:
                throw new Error("Multiple matching tokens detected");
        }
        if (!result && cacheQueryData.subjectType !== TokenCacheKey_1.TokenSubjectType.Client) {
            const sameCloudEntries = this.queryCache(null, cacheQueryData.clientId, cacheQueryData.subjectType, cacheQueryData.uniqueId, cacheQueryData.displayableId)
                .filter((item) => TokenCache.isSameCloud(item.key.authority, cacheQueryData.authority));
            if (sameCloudEntries.length) {
                result = sameCloudEntries[0];
            }
        }
        return result;
    }
}
TokenCache.delimiter = ":::";
TokenCache.expirationMarginInMinutes = 5;
TokenCache.logger = new AdalLogger_1.ConsoleLogger(Utils_1.Utils.guidEmpty);
TokenCache.$defaultShared = new TokenCache(TokenCache.logger);
exports.TokenCache = TokenCache;
//# sourceMappingURL=TokenCache.js.map