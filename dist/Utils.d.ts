/// <reference types="node" />
import { AuthenticationResultEx } from "./AuthenticationResultEx";
import { TokenCache } from "./TokenCache";
export interface IPostResponse {
    headers: any;
    statusCode: number;
    statusMessage: string;
    body: Buffer;
}
export declare class Utils {
    static guidEmpty: string;
    static tokenTimeToJsDate(time: string): Date;
    static refreshAccessTokenAsync(url: string, authority: string, resource: string, clientId: string, resultEx: AuthenticationResultEx, tokenCache: TokenCache): Promise<AuthenticationResultEx>;
    static getAuthTokenInteractiveAsync(authority: string, authorizeUrl: string, accessTokenUrl: string, clientId: string, redirectUri: string, tenantId: string, resourceId: string, scope: string, tokenCache: TokenCache): Promise<AuthenticationResultEx>;
    static postRequestAsync(url: string, parameters: object): Promise<IPostResponse>;
    static trimStart(input: string, character: string): string;
    static trimEnd(input: string, character: string): string;
    static trim(input: string, character: string): string;
    static escapeRegExp(input: string): string;
}
