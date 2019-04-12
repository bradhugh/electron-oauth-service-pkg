import { IPlatformParameters } from "../../internal/platform/IPlatformParameters";
import { IWebUI } from "../../internal/platform/IWebUI";
import { IWebUIFactory } from "../../internal/platform/IWebUIFactory";
export declare class WebUIFactory implements IWebUIFactory {
    createAuthenticationDialog(inputParameters: IPlatformParameters): IWebUI;
}
