import { ICoreLogger } from "./CoreLoggerBase";
export declare class RequestContext {
    clientId: string;
    logger: ICoreLogger;
    telemetryRequestId: string;
    constructor(clientId: string, logger: ICoreLogger);
}
