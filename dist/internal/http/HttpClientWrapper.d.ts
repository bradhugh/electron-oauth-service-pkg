import { CallState } from "../CallState";
import { IHttpClient } from "../platform/IHttpClient";
import { IRequestParameters } from "../RequestParameters";
import { HttpHeaderCollection } from "./HttpHeaderCollection";
import { IHttpWebResponse } from "./IHttpWebResponse";
export declare class HttpClientWrapper implements IHttpClient {
    bodyParameters: IRequestParameters;
    accept: string;
    contentType: string;
    useDefaultCredentials: boolean;
    headers: HttpHeaderCollection;
    protected callState: CallState;
    private uri;
    private _timeoutInMilliSeconds;
    constructor(uri: string, callState: CallState);
    timeoutInMilliSeconds: number;
    getResponseAsync(): Promise<IHttpWebResponse>;
    private electronRequestAsync;
    private verifyCorrelationIdHeaderInReponse;
}
