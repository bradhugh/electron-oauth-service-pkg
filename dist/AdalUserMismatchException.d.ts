import { AdalError } from "./AdalError";
export declare class AdalUserMismatchError extends AdalError {
    requestedUser: string;
    returnedUser: string;
    constructor(requestedUser: string, returnedUser: string);
    toString(): string;
}
