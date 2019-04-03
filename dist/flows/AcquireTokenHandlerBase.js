"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ClientKey {
    constructor(clientId) {
        this.clientId = clientId;
    }
    addToParameters(parameters) {
        if (this.clientId) {
            parameters["client_id"] = this.clientId;
        }
    }
}
exports.ClientKey = ClientKey;
class AcquireTokenHandlerBase {
}
exports.AcquireTokenHandlerBase = AcquireTokenHandlerBase;
//# sourceMappingURL=AcquireTokenHandlerBase.js.map