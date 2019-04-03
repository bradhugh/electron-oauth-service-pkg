import { IServiceBundle } from "../core/ServiceBundle";
import { RequestContext } from "../core/RequestContext";
export declare enum AuthorityType {
    AAD = 0,
    ADFS = 1
}
export declare class Authenticator {
    private tenantlessTenantName;
    private _validateAuthority;
    private _updatedFromTemplate;
    private _authority;
    private _authorityType;
    private _serviceBundle;
    private _authorizationUri;
    private _deviceCodeUri;
    private _tokenUri;
    private _userRealmUriPrefix;
    private _isTenantless;
    private _selfSignedJwtAudience;
    readonly validateAuthority: boolean;
    readonly authority: string;
    readonly authorityType: AuthorityType;
    readonly serviceBundle: IServiceBundle;
    readonly authorizationUri: string;
    readonly deviceCodeUri: string;
    readonly userRealmUriPrefix: string;
    readonly isTenantless: boolean;
    readonly selfSignedJwtAudience: string;
    constructor(serviceBundle: IServiceBundle, authority: string, validateAuthority: boolean);
    UpdateAuthorityAsync(serviceBundle: IServiceBundle, authority: string, requestContext: RequestContext): Promise<void>;
    UpdateFromTemplateAsync(requestContext: RequestContext): Promise<void>;
    static ensureUrlEndsWithForwardSlash(uri: string): string;
    static DetectAuthorityType(authority: string): AuthorityType;
    private static isAdfsAuthority;
    private init;
}
