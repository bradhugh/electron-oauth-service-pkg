"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenCacheItem {
    constructor(key, result) {
        this.authority = key.authority;
        this.resource = key.resource;
        this.clientId = key.clientId;
        this.tokenSubjectType = key.tokenSubjectType;
        this.uniqueId = key.uniqueId;
        this.displayableId = key.displayableId;
        this.tenantId = result.tenantId;
        this.expiresOn = result.expiresOn;
        this.accessToken = result.accessToken;
        this.idToken = result.idToken;
    }
    match(key) {
        if (key.authority === this.authority
            && key.resourceEquals(this.resource)
            && key.clientIdEquals(this.clientId)
            && key.tokenSubjectType === this.tokenSubjectType
            && key.uniqueId === this.uniqueId) {
            return key.displayableIdEquals(this.displayableId);
        }
        return false;
    }
}
exports.TokenCacheItem = TokenCacheItem;
//# sourceMappingURL=TokenCacheItem.js.map