"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalError_1 = require("./AdalError");
const AdalErrorCode_1 = require("./AdalErrorCode");
const Constants_1 = require("./Constants");
class AdalUserMismatchError extends AdalError_1.AdalError {
    constructor(requestedUser, returnedUser) {
        super(AdalErrorCode_1.AdalErrorCode.userMismatch, Constants_1.AdalErrorMessage.userMismatch(returnedUser, requestedUser), null);
        this.requestedUser = requestedUser;
        this.returnedUser = returnedUser;
    }
    toString() {
        return super.toString() + `\n\tRequestedUser: ${this.requestedUser}\n\tReturnedUser: ${this.returnedUser}`;
    }
}
exports.AdalUserMismatchError = AdalUserMismatchError;
//# sourceMappingURL=AdalUserMismatchException.js.map