import { CallState } from "../CallState";
import { IHttpClient } from "../platform/IHttpClient";
import { IRequestParameters } from "../RequestParameters";
import { HttpHeaderCollection } from "./HttpHeaderCollection";
export declare class HttpClientWrapper implements IHttpClient {
    static createResponseAsync(response: any): Promise<any>;
    bodyParameters: IRequestParameters;
    accept: string;
    contentType: string;
    useDefaultCredentials: boolean;
    headers: HttpHeaderCollection;
    protected callState: CallState;
    private uri;
    private _timeoutInMilliSeconds;
    private _maxResponseSizeInBytes;
    constructor(uri: string, callState: CallState);
    timeoutInMilliSeconds: number;
    getResponseAsync(): Promise<any>;
}
