"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PlatformInformation_1 = require("../platform/PlatformInformation");
class AdalIdParameter {
}
AdalIdParameter.product = "x-client-SKU";
AdalIdParameter.version = "x-client-Ver";
AdalIdParameter.cpuPlatform = "x-client-CPU";
AdalIdParameter.os = "x-client-OS";
AdalIdParameter.deviceModel = "x-client-DM";
exports.AdalIdParameter = AdalIdParameter;
class AdalIdHelper {
    static getAdalIdParameters() {
        const parameters = new Map();
        parameters.set(AdalIdParameter.product, new PlatformInformation_1.PlatformInformation().getProductName());
        parameters.set(AdalIdParameter.version, AdalIdHelper.getAdalVersion());
        const processorInformation = new PlatformInformation_1.PlatformInformation().getProcessorArchitecture();
        if (processorInformation != null) {
            parameters.set(AdalIdParameter.cpuPlatform, processorInformation);
        }
        const osInformation = new PlatformInformation_1.PlatformInformation().getOperatingSystem();
        if (osInformation != null) {
            parameters.set(AdalIdParameter.os, osInformation);
        }
        const deviceInformation = new PlatformInformation_1.PlatformInformation().getDeviceModel();
        if (deviceInformation != null) {
            parameters.set(AdalIdParameter.deviceModel, deviceInformation);
        }
        return parameters;
    }
    static getAdalVersion() {
        return AdalIdHelper.versionNotDetermined;
    }
    static getAssemblyFileVersion() {
        return new PlatformInformation_1.PlatformInformation().getAssemblyFileVersionAttribute();
    }
    static getClientVersion() {
        let clientVersion = AdalIdHelper.getAdalVersion();
        if (AdalIdHelper.versionNotDetermined === clientVersion) {
            clientVersion = AdalIdHelper.getAssemblyFileVersion();
        }
        return clientVersion;
    }
    static getAssemblyInformationalVersion() {
        return AdalIdHelper.versionNotDetermined;
    }
}
AdalIdHelper.versionNotDetermined = "0.0.0.0";
exports.AdalIdHelper = AdalIdHelper;
//# sourceMappingURL=AdalIdHelper.js.map