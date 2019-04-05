import { AdalError } from "./AdalError";
import { HttpHeaderCollection } from "./internal/http/HttpHeaderCollection";
import { HttpStatusCode } from "./internal/http/HttpStatusCode";
export declare class AdalServiceError extends AdalError {
    serviceErrorCodes: string[];
    statusCode: HttpStatusCode;
    headers: HttpHeaderCollection;
    constructor(errorCode: string, message: string, serviceErrorCodes: string[], innerError: Error);
    toString(): string;
}
