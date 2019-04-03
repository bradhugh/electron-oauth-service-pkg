export declare enum TokenSubjectType {
    User = 0,
    Client = 1,
    UserPlusClient = 2
}
export declare class TokenCacheKey {
    authority: string;
    resource: string;
    clientId: string;
    tokenSubjectType: TokenSubjectType;
    uniqueId: string;
    displayableId: string;
    static fromStringKey(stringKey: string): TokenCacheKey;
    constructor(authority: string, resource: string, clientId: string, tokenSubjectType: TokenSubjectType, uniqueId: string, displayableId: string);
    toStringKey(): string;
    resourceEquals(otherResource: string): boolean;
    clientIdEquals(otherClientId: string): boolean;
    displayableIdEquals(otherDisplayableId: string): boolean;
}
