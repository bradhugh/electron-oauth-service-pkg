import { RequestContext } from "../RequestContext";
import { HttpResponse } from "./HttpResponse";
export interface IHttpManager {
    sendPostAsync(endpoint: string, headers: {
        [key: string]: string;
    }, bodyParameters: {
        [key: string]: string;
    }, requestContext: RequestContext): Promise<HttpResponse>;
    sendPostWithContentAsync(endpoint: string, headers: {
        [key: string]: string;
    }, body: string, requestContext: RequestContext): Promise<HttpResponse>;
    sendGetAsync(endpoint: string, headers: {
        [key: string]: string;
    }, requestContext: RequestContext): Promise<HttpResponse>;
    sendPostForceResponseAsync(endpoint: string, headers: {
        [key: string]: string;
    }, body: string, requestContext: RequestContext): Promise<HttpResponse>;
}
export declare class HttpError extends Error {
    response: HttpResponse;
    constructor(message: string, response: HttpResponse);
}
export declare class HttpManager implements IHttpManager {
    sendPostAsync(endpoint: string, headers: {
        [key: string]: string;
    }, bodyParameters: {
        [key: string]: string;
    }, requestContext: RequestContext): Promise<HttpResponse>;
    sendPostWithContentAsync(endpoint: string, headers: {
        [key: string]: string;
    }, body: string, requestContext: RequestContext): Promise<HttpResponse>;
    sendGetAsync(endpoint: string, headers: {
        [key: string]: string;
    }, requestContext: RequestContext): Promise<HttpResponse>;
    sendPostForceResponseAsync(endpoint: string, headers: {
        [key: string]: string;
    }, body: string, requestContext: RequestContext): Promise<HttpResponse>;
    private requestCommonAsync;
}
