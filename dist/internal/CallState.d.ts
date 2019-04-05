import { ICoreLogger } from "../core/CoreLoggerBase";
export declare class CallState {
    correlationId: string;
    static default: CallState;
    logger: ICoreLogger;
    constructor(correlationId: string);
}
