"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RequestContext {
    constructor(clientId, logger) {
        this.clientId = clientId;
        this.logger = logger;
        this.clientId = !clientId ? "unset_client_id" : clientId;
    }
}
exports.RequestContext = RequestContext;
//# sourceMappingURL=RequestContext.js.map