import { TokenCache } from "../TokenCache";
import { TokenSubjectType } from "../internal/cache/TokenCacheKey";
export declare class ClientKey {
    clientId: string;
    constructor(clientId: string);
    addToParameters(parameters: {
        [key: string]: string;
    }): void;
}
export interface RequestData {
    tokenCache: TokenCache;
    resource: string;
    clientKey: ClientKey;
    subjectType: TokenSubjectType;
    extendedLifeTimeEnabled: boolean;
}
export declare class AcquireTokenHandlerBase {
    resource: string;
}
