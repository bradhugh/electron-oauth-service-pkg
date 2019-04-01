"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TokenCacheKey {
    constructor(authority, resource, clientId, tokenSubjectType, uniqueId, displayableId) {
        this.authority = authority;
        this.resource = resource;
        this.clientId = clientId;
        this.tokenSubjectType = tokenSubjectType;
        this.uniqueId = uniqueId;
        this.displayableId = displayableId;
    }
    getStringKey() {
        return `${this.authority}:::${this.resource.toLowerCase()}:::${this.clientId.toLowerCase()}` +
            `:::${this.uniqueId ? this.uniqueId : ''}` +
            `:::${this.displayableId ? this.displayableId.toLowerCase() : ''}` +
            `:::${this.tokenSubjectType}`;
    }
    static fromStringKey(stringKey) {
        const exp = new RegExp(/^(.+):::(.+):::(.+):::(.*):::(.*):::(.+)$/);
        const match = exp.exec(stringKey);
        if (!match) {
            throw new Error(`Token cache key ${stringKey} is in the incorrect format!`);
        }
        const authority = match[1];
        const resourceId = match[2];
        const clientId = match[3];
        const uniqueId = match[4];
        const displayableId = match[5];
        const tokenSubjectType = parseInt(match[6]);
        return new TokenCacheKey(authority, resourceId, clientId, tokenSubjectType, uniqueId, displayableId);
    }
    resourceEquals(otherResource) {
        return otherResource.toLowerCase() === this.resource.toLowerCase();
    }
    clientIdEquals(otherClientId) {
        return otherClientId.toLowerCase() === this.clientId.toLowerCase();
    }
    displayableIdEquals(otherDisplayableId) {
        return otherDisplayableId.toLowerCase() === this.displayableId.toLowerCase();
    }
}
exports.TokenCacheKey = TokenCacheKey;
//# sourceMappingURL=TokenCacheKey.js.map