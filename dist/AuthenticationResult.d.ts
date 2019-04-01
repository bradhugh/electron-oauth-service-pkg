export declare class UserInfo {
    uniqueId?: string;
    displayableId?: string;
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
    updateTenantAndUserInfo(tenantId: string, idToken: string, userInfo: UserInfo): void;
}
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
