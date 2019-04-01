export declare class UserInfo {
}
export declare class AuthenticationResult {
    accessToken: string;
    accessTokenType: string;
    authority: string;
    expiresOn: Date;
    extendedExpiresOn: Date;
    extendedLifeTimeToken: boolean;
    idToken: string;
    tenantId: string;
    userInfo: UserInfo;
    constructor(accessTokenType: string, accessToken: string, expiresOn: Date, extendedExpiresOn?: Date);
}
export declare class AuthenticationContext {
    private authority;
    private authorizeUrl;
    private accessTokenUrl;
    private redirectUri;
    private tokenCache;
    constructor(authority: string, authorizeUrl: string, accessTokenUrl: string, redirectUri: string);
    acquireTokenAsync(tenant: string, resource: string, scope: string, clientId: string, redirectUri?: string): Promise<AuthenticationResult>;
}
