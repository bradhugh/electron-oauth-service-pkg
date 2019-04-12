"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OAuthConstants_1 = require("../oauth2/OAuthConstants");
class ClientKey {
    constructor(clientId) {
        this.clientId = clientId;
        this.hasCredential = false;
    }
    addToParameters(parameters) {
        if (this.clientId) {
            parameters.set(OAuthConstants_1.OAuthParameter.clientId, this.clientId);
        }
    }
}
exports.ClientKey = ClientKey;
//# sourceMappingURL=ClientKey.js.map