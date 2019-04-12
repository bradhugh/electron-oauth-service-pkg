import { AuthenticationResult } from "./AuthenticationResult";
import { Authenticator } from "./instance/Authenticator";
import { IPlatformParameters } from "./internal/platform/IPlatformParameters";
import { TokenCache } from "./TokenCache";
import { UserIdentifier } from "./UserIdentifier";
export declare enum AuthorityValidationType {
    True = 0,
    False = 1,
    NotProvided = 2
}
export declare class AuthenticationContext {
    authority: string;
    tokenCache: TokenCache;
    extendedLifeTimeEnabled: boolean;
    authenticator: Authenticator;
    private callState;
    constructor(authority: string, validateAuthority?: AuthorityValidationType, tokenCache?: TokenCache);
    getCachedResult(resource: string, clientId: string): AuthenticationResult;
    acquireTokenAsync(resource: string, clientId: string, redirectUri: string, parameters: IPlatformParameters, userId: UserIdentifier, extraQueryParameters: string): Promise<AuthenticationResult>;
    acquireTokenSilentAsync(resource: string, clientId: string, userId: UserIdentifier, parameters: IPlatformParameters): Promise<AuthenticationResult>;
    clearCache(): void;
    private acquireTokenCommonAsync;
    private acquireTokenSilentCommonAsync;
    private createWebAuthenticationDialog;
}
