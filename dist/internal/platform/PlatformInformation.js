"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlatformInformationBase_1 = require("./PlatformInformationBase");
class PlatformInformation extends PlatformInformationBase_1.PlatformInformationBase {
    getProductName() {
        return "Electron OAuth Service module";
    }
    getEnvironmentVariable(variable) {
        return null;
    }
    getUserPrincipalNameAsync() {
        return __awaiter(this, void 0, void 0, function* () {
            return "user@contoso.com";
        });
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