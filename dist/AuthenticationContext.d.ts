import { AuthenticationResult } from "./AuthenticationResult";
export declare class AuthenticationContext {
    private authority;
    private authorizeUrl;
    private accessTokenUrl;
    private redirectUri;
    private logger;
    private tokenCache;
    private callState;
    constructor(authority: string, authorizeUrl: string, accessTokenUrl: string, redirectUri: string);
    acquireTokenSilentAsync(tenant: string, resource: string, clientId: string, redirectUri?: string): Promise<AuthenticationResult>;
    getCachedResult(resource: string, clientId: string): AuthenticationResult;
    acquireTokenAsync(tenant: string, resource: string, clientId: string, redirectUri?: string, silent?: boolean): Promise<AuthenticationResult>;
    clearCache(): void;
}
