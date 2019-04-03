import { AuthenticationResult } from "./AuthenticationResult";
import { TokenCacheKey, TokenSubjectType } from "./internal/cache/TokenCacheKey";
export declare class TokenCacheItem {
    authority: string;
    clientId: string;
    expiresOn: Date;
    familyName: string;
    givenName: string;
    identityProvider: string;
    resource: string;
    tenantId: string;
    uniqueId: string;
    displayableId: string;
    accessToken: string;
    idToken: string;
    tokenSubjectType: TokenSubjectType;
    constructor(key: TokenCacheKey, result: AuthenticationResult);
    match(key: TokenCacheKey): boolean;
}
