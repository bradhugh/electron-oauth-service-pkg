import { AuthorizationResult } from "../../internal/AuthorizationResult";
import { CallState } from "../../internal/CallState";
import { IWebUI } from "../../internal/platform/IWebUI";
export declare class InteractiveWebUI implements IWebUI {
    private ownerWindow;
    constructor(ownerWindow: object);
    acquireAuthorizationAsync(authorizationUri: URL, redirectUri: URL, callState: CallState): Promise<AuthorizationResult>;
}
