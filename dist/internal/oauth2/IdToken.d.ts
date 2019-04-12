export declare class IdTokenClaim {
    static objectId: string;
    static subject: string;
    static tenantId: string;
    static upn: string;
    static email: string;
    static givenName: string;
    static familyName: string;
    static identityProvider: string;
    static issuer: string;
    static passwordExpiration: string;
    static passwordChangeUrl: string;
}
export interface IJsonIdToken {
    oid: string;
    sub: string;
    tid: string;
    upn: string;
    email: string;
    given_name: string;
    family_name: string;
    idp: string;
    iss: string;
    pwd_exp: number;
    pwd_url: string;
}
export declare class IdToken {
    static fromJsonToken(jsonToken: IJsonIdToken): IdToken;
    static parse(idToken: string): IdToken;
    objectId: string;
    subject: string;
    tenantId: string;
    upn: string;
    givenName: string;
    familyName: string;
    email: string;
    passwordExpiration: number;
    passwordChangeUrl: string;
    identityProvider: string;
    issuer: string;
}
