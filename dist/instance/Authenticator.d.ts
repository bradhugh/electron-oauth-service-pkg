import { CallState } from "../internal/CallState";
export declare enum AuthorityType {
    AAD = 0,
    ADFS = 1
}
export declare class Authenticator {
    static ensureUrlEndsWithForwardSlash(uri: string): string;
    static detectAuthorityType(authority: string): AuthorityType;
    private static tenantNameRegex;
    private static isAdfsAuthority;
    correlationId: string;
    private tenantlessTenantName;
    private _validateAuthority;
    private _updatedFromTemplate;
    private _authority;
    private _authorityType;
    private _authorizationUri;
    private _deviceCodeUri;
    private _tokenUri;
    private _userRealmUriPrefix;
    private _isTenantless;
    private _selfSignedJwtAudience;
    readonly validateAuthority: boolean;
    readonly authority: string;
    readonly authorityType: AuthorityType;
    readonly authorizationUri: string;
    readonly deviceCodeUri: string;
    readonly userRealmUriPrefix: string;
    readonly isTenantless: boolean;
    readonly selfSignedJwtAudience: string;
    readonly tokenUri: string;
    constructor(authority: string, validateAuthority: boolean);
    getAuthorityHost(): string;
    updateTenantId(tenantId: string): void;
    updateAuthorityAsync(authority: string, callState: CallState): Promise<void>;
    updateFromTemplateAsync(callState: CallState): Promise<void>;
    private init;
    private replaceTenantlessTenant;
}
