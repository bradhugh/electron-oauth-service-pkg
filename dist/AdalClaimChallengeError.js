"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalServiceError_1 = require("./AdalServiceError");
class AdalClaimChallengeException extends AdalServiceError_1.AdalServiceError {
    constructor(errorCode, message, innerException, claims) {
        super(errorCode, message, null, innerException);
        this.claims = claims;
    }
}
exports.AdalClaimChallengeException = AdalClaimChallengeException;
//# sourceMappingURL=AdalClaimChallengeError.js.map