import { IHttpWebResponse } from "./http/IHttpWebResponse";
export declare class HttpRequestWrapperError extends Error {
    webResponse: IHttpWebResponse;
    innerError: Error;
    constructor(webResponse: IHttpWebResponse, innerError: Error);
}
