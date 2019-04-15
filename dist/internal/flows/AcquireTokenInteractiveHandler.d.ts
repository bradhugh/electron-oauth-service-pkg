import { AuthenticationResultEx } from "../../AuthenticationResultEx";
import { AcquireTokenHandlerBase } from "../../flows/AcquireTokenHandlerBase";
import { ILogger } from "../../ILogger";
import { UserIdentifier } from "../../UserIdentifier";
import { AuthorizationResult } from "../AuthorizationResult";
import { IPlatformParameters } from "../platform/IPlatformParameters";
import { IWebUI } from "../platform/IWebUI";
import { IRequestData } from "../RequestData";
import { DictionaryRequestParameters } from "../RequestParameters";
export declare class AcquireTokenInteractiveHandler extends AcquireTokenHandlerBase {
    private static replaceHost;
    authorizationResult: AuthorizationResult;
    private redirectUri;
    private redirectUriRequestParameter;
    private authorizationParameters;
    private extraQueryParameters;
    private webUi;
    private userId;
    private claims;
    constructor(requestData: IRequestData, redirectUri: URL, parameters: IPlatformParameters, userId: UserIdentifier, extraQueryParameters: string, webUI: IWebUI, claims: string, logger: ILogger);
    AcquireAuthorizationAsync(): Promise<void>;
    createAuthorizationUriAsync(correlationId: string): Promise<URL>;
    protected preTokenRequestAsync(): Promise<void>;
    protected addAdditionalRequestParameters(requestParameters: DictionaryRequestParameters): void;
    protected postTokenRequestAsync(resultEx: AuthenticationResultEx): Promise<void>;
    protected updateBrokerParameters(parameters: Map<string, string>): void;
    protected brokerInvocationRequired(): boolean;
    private createAuthorizationUri;
    private createAuthorizationRequest;
    private verifyAuthorizationResult;
}
