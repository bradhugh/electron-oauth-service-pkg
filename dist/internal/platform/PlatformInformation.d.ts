import { PlatformInformationBase } from "./PlatformInformationBase";
export declare class PlatformInformation extends PlatformInformationBase {
    getProductName(): string;
    getEnvironmentVariable(variable: string): string;
    getUserPrincipalNameAsync(): Promise<string>;
    getProcessorArchitecture(): string;
    getOperatingSystem(): string;
    getDeviceModel(): string;
}
