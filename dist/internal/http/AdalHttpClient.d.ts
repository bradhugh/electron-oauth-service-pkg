import { CallState } from "../CallState";
import { IHttpClient } from "../platform/IHttpClient";
export declare class AdalHttpClient {
    callState: CallState;
    private static deviceAuthHeaderName;
    private static deviceAuthHeaderValue;
    private static wwwAuthenticateHeader;
    private static pKeyAuthName;
    private static delayTimePeriodMilliSeconds;
    private static checkForExtraQueryParameter;
    resiliency: boolean;
    retryOnce: boolean;
    requestUri: string;
    client: IHttpClient;
    private _callState;
    constructor(uri: string, callState: CallState);
    getResponseAsync<T>(respondToDeviceAuthChallenge?: boolean): Promise<T>;
    private isDeviceAuthChallenge;
    private ParseChallengeData;
    private HandleDeviceAuthChallengeAsync;
}
