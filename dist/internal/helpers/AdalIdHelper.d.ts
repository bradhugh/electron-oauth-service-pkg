export declare class AdalIdParameter {
    static product: string;
    static version: string;
    static cpuPlatform: string;
    static os: string;
    static deviceModel: string;
}
export declare class AdalIdHelper {
    static versionNotDetermined: string;
    static getAdalIdParameters(): Map<string, string>;
    static getAdalVersion(): string;
    static getAssemblyFileVersion(): string;
    static getClientVersion(): string;
    static getAssemblyInformationalVersion(): string;
}
