"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlatformInformationBase_1 = require("./PlatformInformationBase");
class PlatformInformation extends PlatformInformationBase_1.PlatformInformationBase {
    getProductName() {
        return "Electron OAuth Service module";
    }
    getEnvironmentVariable(variable) {
        return null;
    }
    async getUserPrincipalNameAsync() {
        return "user@contoso.com";
    }
    getProcessorArchitecture() {
        return "x64";
    }
    getOperatingSystem() {
        return "Windows 10";
    }
    getDeviceModel() {
        return "Windows 10";
    }
}
exports.PlatformInformation = PlatformInformation;
//# sourceMappingURL=PlatformInformation.js.map