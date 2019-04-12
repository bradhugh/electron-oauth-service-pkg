import { AuthenticationResultEx } from "../../AuthenticationResultEx";
import { IHttpWebResponse } from "../http/IHttpWebResponse";
export declare class TokenResponseClaim {
    static code: string;
    static tokenType: string;
    static accessToken: string;
    static refreshToken: string;
    static resource: string;
    static idToken: string;
    static createdOn: string;
    static expiresOn: string;
    static expiresIn: string;
    static extendedExpiresIn: string;
    static error: string;
    static errorDescription: string;
    static errorCodes: string;
    static claims: string;
    static cloudInstanceHost: string;
    static authority: string;
}
export interface IJsonTokenResponse {
    token_type: string;
    access_token: string;
    refresh_token: string;
    resource: string;
    id_token: string;
    created_on: number;
    expires_on: number;
    expires_in: number;
    ext_expires_in: number;
    error: string;
    error_description: string;
    error_codes: string[];
    correlation_id: string;
    claims: string;
}
export declare class TokenResponse {
    static createFromErrorResponse(webResponse: IHttpWebResponse): TokenResponse;
    static fromJson(jsonResp: IJsonTokenResponse): TokenResponse;
    tokenType: string;
    accessToken: string;
    refreshToken: string;
    resource: string;
    idTokenString: string;
    createdOn: number;
    expiresOn: number;
    expiresIn: number;
    extendedExpiresIn: number;
    error: string;
    errorDescription: string;
    errorCodes: string[];
    correlationId: string;
    claims: string;
    authority: string;
    getResult(): AuthenticationResultEx;
    getResultWithDates(expiresOn: Date, extendedExpiresOn: Date): AuthenticationResultEx;
}
