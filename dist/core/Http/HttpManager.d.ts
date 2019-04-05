import { HttpResponse } from "./HttpResponse";
import { CallState } from "../../internal/CallState";
export interface IHttpManager {
    sendPostAsync(endpoint: string, headers: {
        [key: string]: string;
    }, bodyParameters: {
        [key: string]: string;
    }, callState: CallState): Promise<HttpResponse>;
    sendPostWithContentAsync(endpoint: string, headers: {
        [key: string]: string;
    }, body: string, callState: CallState): Promise<HttpResponse>;
    sendGetAsync(endpoint: string, headers: {
        [key: string]: string;
    }, callState: CallState): Promise<HttpResponse>;
    sendPostForceResponseAsync(endpoint: string, headers: {
        [key: string]: string;
    }, body: string, callState: CallState): Promise<HttpResponse>;
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
    }, callState: CallState): Promise<HttpResponse>;
    sendPostWithContentAsync(endpoint: string, headers: {
        [key: string]: string;
    }, body: string, callState: CallState): Promise<HttpResponse>;
    sendGetAsync(endpoint: string, headers: {
        [key: string]: string;
    }, callState: CallState): Promise<HttpResponse>;
    sendPostForceResponseAsync(endpoint: string, headers: {
        [key: string]: string;
    }, body: string, callState: CallState): Promise<HttpResponse>;
    private requestCommonAsync;
}
