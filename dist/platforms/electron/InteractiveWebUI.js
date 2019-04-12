"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ElectronWebAuthenticationDialog_1 = require("./ElectronWebAuthenticationDialog");
class InteractiveWebUI {
    constructor(ownerWindow) {
        this.ownerWindow = ownerWindow;
    }
    acquireAuthorizationAsync(authorizationUri, redirectUri, callState) {
        callState.logger.infoPii(`Authorization URL: ${authorizationUri.href}`);
        const dialog = new ElectronWebAuthenticationDialog_1.ElectronWebAuthenticationDialog(this.ownerWindow);
        return dialog.authenticateAAD(authorizationUri, redirectUri);
    }
}
exports.InteractiveWebUI = InteractiveWebUI;
//# sourceMappingURL=InteractiveWebUI.js.map