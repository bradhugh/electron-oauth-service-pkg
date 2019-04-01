import { TokenSubjectType } from "./TokenCache";
export declare class TokenCacheKey {
    authority: string;
    resource: string;
    clientId: string;
    tokenSubjectType: TokenSubjectType;
    uniqueId: string;
    displayableId: string;
    constructor(authority: string, resource: string, clientId: string, tokenSubjectType: TokenSubjectType, uniqueId: string, displayableId: string);
    getStringKey(): string;
    static fromStringKey(stringKey: string): TokenCacheKey;
    resourceEquals(otherResource: string): boolean;
    clientIdEquals(otherClientId: string): boolean;
    displayableIdEquals(otherDisplayableId: string): boolean;
}
