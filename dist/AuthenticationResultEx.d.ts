import { AuthenticationResult } from "./AuthenticationResult";
export declare class AuthenticationResultEx {
    static deserialize(serializedObject: string): AuthenticationResultEx;
    result: AuthenticationResult;
    refreshToken: string;
    isMultipleResourceRefreshToken: boolean;
    resourceInResponse: string;
    error: Error;
    userAssertionHash: string;
    serialize(): string;
    clone(): AuthenticationResultEx;
}
