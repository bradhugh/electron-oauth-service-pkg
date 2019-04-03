import { IHttpManager } from "./core/Http/HttpManager";
export declare class AuthenticationParameters {
    private httpManager;
    private static authenticateHeader;
    private static bearer;
    private static authorityKey;
    private static resourceKey;
    authority: string;
    resource: string;
    constructor(httpManager: IHttpManager);
    createFromResourceUrlAsync(resourceUrl: URL): Promise<AuthenticationParameters>;
    createFromResponseAuthenticateHeader(authenticateHeader: string): AuthenticationParameters;
    private createFromResourceUrlCommonAsync;
    private createFromUnauthorizedResponseCommon;
}
