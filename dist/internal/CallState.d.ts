import { ILogger } from "../ILogger";
export declare class CallState {
    correlationId: string;
    logger: ILogger;
    constructor(correlationId: string, logger: ILogger);
}
