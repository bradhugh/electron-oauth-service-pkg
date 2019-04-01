import { AuthenticationResult } from "../AuthenticationContext";
export declare class AuthenticationResultEx {
    result: AuthenticationResult;
    refreshToken: string;
    isMultipleResourceRefreshToken: boolean;
    resourceInResponse: string;
    error: Error;
    userAssertionHash: string;
    static deserialize(serializedObject: string): AuthenticationResultEx;
    serialize(): string;
    clone(): AuthenticationResultEx;
}
