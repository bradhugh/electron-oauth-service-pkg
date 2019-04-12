import { AuthenticationResultEx } from "../../AuthenticationResultEx";
import { AcquireTokenHandlerBase } from "../../flows/AcquireTokenHandlerBase";
import { UserIdentifier } from "../../UserIdentifier";
import { IPlatformParameters } from "../platform/IPlatformParameters";
import { IRequestData } from "../RequestData";
import { DictionaryRequestParameters } from "../RequestParameters";
export declare class AcquireTokenSilentHandler extends AcquireTokenHandlerBase {
    constructor(requestData: IRequestData, userId: UserIdentifier, parameters: IPlatformParameters);
    protected sendTokenRequestAsync(): Promise<AuthenticationResultEx>;
    protected addAdditionalRequestParameters(requestParameters: DictionaryRequestParameters): void;
}
