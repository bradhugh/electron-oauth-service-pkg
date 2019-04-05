export declare enum ErrorFormat {
    Json = 0,
    Other = 1
}
export declare class AdalError extends Error {
    errorCode: string;
    message: string;
    innerError: Error;
    static getErrorMessage(errorCode: string): string;
    constructor(errorCode: string, message: string, innerError: Error);
    toString(): string;
}
