import { AuthenticationResult } from "../AuthenticationResult";
import { AuthenticationResultEx } from "../AuthenticationResultEx";
import { Authenticator } from "../instance/Authenticator";
import { TokenSubjectType } from "../internal/cache/TokenCacheKey";
import { CallState } from "../internal/CallState";
import { IRequestData } from "../internal/RequestData";
export declare class ClientKey {
    clientId: string;
    constructor(clientId: string);
    addToParameters(parameters: Map<string, string>): void;
}
export declare class AcquireTokenHandlerBase {
    static createCallState(correlationId: string): CallState;
    protected static nullResource: string;
    callState: CallState;
    protected supportAdfs: boolean;
    protected authenticator: Authenticator;
    protected resource: string;
    protected clientKey: ClientKey;
    protected resultEx: AuthenticationResultEx;
    protected tokenSubjectType: TokenSubjectType;
    protected uniqueId: string;
    protected displayableId: string;
    protected loadFromCache: boolean;
    protected storeToCache: boolean;
    private tokenCache;
    private brokerParameters;
    private cacheQueryData;
    private client;
    protected constructor(requestData: IRequestData);
    runAsync(): Promise<AuthenticationResult>;
    protected preRunAsync(): Promise<void>;
    protected validateAuthorityType(): void;
    protected sendTokenRequestByRefreshTokenAsync(refreshToken: string): Promise<AuthenticationResultEx>;
    private sendHttpMessageAsync;
    private storeResultExToCacheAsync;
    private refreshAccessTokenAsync;
    private notifyBeforeAccessCache;
    private notifyAfterAccessCache;
}
