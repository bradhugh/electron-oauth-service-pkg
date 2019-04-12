import { AdalServiceError } from "./AdalServiceError";
export declare class AdalClaimChallengeException extends AdalServiceError {
    claims: string;
    constructor(errorCode: string, message: string, innerException: Error, claims: string);
}
