"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const AuthorizationResult_1 = require("../../internal/AuthorizationResult");
class ElectronWebAuthenticationDialog {
    constructor(ownerWindow) {
        this.callbackUri = null;
        this.window = null;
        if (ownerWindow) {
            if (!(ownerWindow instanceof electron_1.BrowserWindow)) {
                throw new Error("ownerWindow must be BrowserWindow");
            }
            this.window = ownerWindow;
        }
        else {
            this.window = new electron_1.BrowserWindow({
                width: 600,
                height: 800,
                webPreferences: {
                    nodeIntegration: false,
                    contextIsolation: true,
                },
            });
        }
    }
    async authenticateAAD(requestUri, callbackUri) {
        this.callbackUri = callbackUri;
        this.window.loadURL(requestUri.href);
        let gotResult = false;
        return new Promise((resolve, reject) => {
            this.window.on("closed", () => {
                if (!gotResult) {
                    reject(new Error("Window was closed"));
                }
            });
            this.window.webContents.on("did-redirect-navigation", (_event, url, _isInPlace, _isMainFrame, _frameProcessId, _frameRoutingId) => {
                if (this.isRedirectUrl(url)) {
                    gotResult = true;
                    this.window.close();
                    resolve(new AuthorizationResult_1.AuthorizationResult(AuthorizationResult_1.AuthorizationStatus.Success, url));
                }
            });
            if (process.platform === "win32") {
                this.window.webContents.on("select-client-certificate", (event, url, certList, callback) => {
                    if (!certList.length) {
                        return false;
                    }
                    event.preventDefault();
                    const certIndex = require("select-client-cert").selectClientCert(certList.map((cert) => cert.data));
                    if (certIndex >= 0) {
                        callback(certList[certIndex]);
                    }
                    return true;
                });
            }
        });
    }
    isRedirectUrl(url) {
        return url.toLowerCase().startsWith(this.callbackUri.href.toLowerCase());
    }
}
exports.ElectronWebAuthenticationDialog = ElectronWebAuthenticationDialog;
//# sourceMappingURL=ElectronWebAuthenticationDialog.js.map