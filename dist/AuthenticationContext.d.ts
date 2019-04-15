import { AuthenticationResult } from "./AuthenticationResult";
import { ILogger } from "./ILogger";
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
    private logger?;
    extendedLifeTimeEnabled: boolean;
    authenticator: Authenticator;
    constructor(authority: string, validateAuthority?: AuthorityValidationType, tokenCache?: TokenCache, logger?: ILogger);
    acquireTokenAsync(resource: string, clientId: string, redirectUri: string, parameters: IPlatformParameters, userId: UserIdentifier, extraQueryParameters: string): Promise<AuthenticationResult>;
    acquireTokenSilentAsync(resource: string, clientId: string, userId: UserIdentifier, parameters: IPlatformParameters): Promise<AuthenticationResult>;
    clearCache(): void;
    private acquireTokenCommonAsync;
    private acquireTokenSilentCommonAsync;
    private createWebAuthenticationDialog;
}
