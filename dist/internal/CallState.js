"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalLogger_1 = require("../core/AdalLogger");
const Utils_1 = require("../Utils");
class CallState {
    constructor(correlationId) {
        this.correlationId = correlationId;
        this.logger = new AdalLogger_1.ConsoleLogger(correlationId);
    }
}
CallState.default = new CallState(Utils_1.Utils.guidEmpty);
exports.CallState = CallState;
//# sourceMappingURL=CallState.js.map