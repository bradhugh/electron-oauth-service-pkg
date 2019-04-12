export declare class UserInfo {
    uniqueId: string;
    displayableId: string;
    givenName: string;
    familyName: string;
    identityProvider: string;
    passwordExpiresOn: Date;
    passwordChangeUrl: URL;
    constructor(other?: UserInfo);
}
