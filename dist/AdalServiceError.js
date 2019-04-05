"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalError_1 = require("./AdalError");
class AdalServiceError extends AdalError_1.AdalError {
    constructor(errorCode, message, serviceErrorCodes, innerError) {
        super(errorCode, message ? message : AdalServiceError.getErrorMessage(errorCode), innerError);
        this.serviceErrorCodes = serviceErrorCodes;
        this.statusCode = 0;
    }
    toString() {
        return super.toString() + `\n\tStatusCode: ${this.statusCode}`;
    }
}
exports.AdalServiceError = AdalServiceError;
//# sourceMappingURL=AdalServiceError.js.map