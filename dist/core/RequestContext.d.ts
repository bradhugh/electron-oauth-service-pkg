import { ILogger } from "../ILogger";
export declare class RequestContext {
    clientId: string;
    logger: ILogger;
    telemetryRequestId: string;
    constructor(clientId: string, logger: ILogger);
}
