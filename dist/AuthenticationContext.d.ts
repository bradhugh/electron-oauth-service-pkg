import { AuthenticationResult } from "./AuthenticationResult";
export declare class AuthenticationContext {
    private authority;
    private authorizeUrl;
    private accessTokenUrl;
    private redirectUri;
    private tokenCache;
    constructor(authority: string, authorizeUrl: string, accessTokenUrl: string, redirectUri: string);
    acquireTokenSilentAsync(tenant: string, resource: string, scope: string, clientId: string, redirectUri?: string): Promise<AuthenticationResult>;
    getCachedResult(resource: string, clientId: string): AuthenticationResult;
    acquireTokenAsync(tenant: string, resource: string, scope: string, clientId: string, redirectUri?: string, silent?: boolean): Promise<AuthenticationResult>;
    clearCache(): void;
}
