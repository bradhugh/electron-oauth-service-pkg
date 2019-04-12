"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalError_1 = require("./AdalError");
const AdalErrorCode_1 = require("./AdalErrorCode");
const Constants_1 = require("./Constants");
class AdalSilentTokenAcquisitionException extends AdalError_1.AdalError {
    constructor(innerError) {
        super(AdalErrorCode_1.AdalErrorCode.failedToAcquireTokenSilently, Constants_1.AdalErrorMessage.failedToAcquireTokenSilently, innerError);
    }
}
exports.AdalSilentTokenAcquisitionException = AdalSilentTokenAcquisitionException;
//# sourceMappingURL=AdalSilentTokenAcquisitionError.js.map