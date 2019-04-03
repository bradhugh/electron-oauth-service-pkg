import { UserInfo } from "./UserInfo";
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
