import { AuthorizationResult } from "../../internal/AuthorizationResult";
export declare class ElectronWebAuthenticationDialog {
    private callbackUri;
    private window;
    constructor(ownerWindow: object);
    authenticateAAD(requestUri: URL, callbackUri: URL): Promise<AuthorizationResult>;
    private isRedirectUrl;
}
