/// <reference types="node" />
import { TokenCache } from "./cache/TokenCache";
import { AuthenticationResultEx } from "./AuthenticationResult";
export interface PostResponse {
    headers: any;
    statusCode: number;
    statusMessage: string;
    body: Buffer;
}
export declare class Utils {
    static tokenTimeToJsDate(time: string): Date;
    static refreshAccessTokenAsync(url: string, authority: string, resource: string, clientId: string, resultEx: AuthenticationResultEx, tokenCache: TokenCache): Promise<AuthenticationResultEx>;
    static getAuthTokenInteractiveAsync(authority: string, authorizeUrl: string, accessTokenUrl: string, clientId: string, redirectUri: string, tenantId: string, resourceId: string, scope: string, tokenCache: TokenCache): Promise<AuthenticationResultEx>;
    static postRequestAsync(url: string, parameters: Object): Promise<PostResponse>;
}
