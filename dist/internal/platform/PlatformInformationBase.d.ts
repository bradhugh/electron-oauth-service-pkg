import { CallState } from "../CallState";
import { DictionaryRequestParameters } from "../RequestParameters";
import { IPlatformParameters } from "./IPlatformParameters";
export declare abstract class PlatformInformationBase {
    abstract getProductName(): string;
    abstract getEnvironmentVariable(variable: string): string;
    abstract getUserPrincipalNameAsync(): Promise<string>;
    abstract getProcessorArchitecture(): string;
    abstract getOperatingSystem(): string;
    abstract getDeviceModel(): string;
    getAssemblyFileVersionAttribute(): string;
    isUserLocalAsync(callState: CallState): Promise<boolean>;
    isDomainJoined(): boolean;
    addPromptBehaviorQueryParameter(parameters: IPlatformParameters, authorizationRequestParameters: DictionaryRequestParameters): void;
    getCacheLoadPolicy(parameters: IPlatformParameters): boolean;
    ValidateRedirectUri(redirectUri: URL, callState: CallState): URL;
    getRedirectUriAsString(redirectUri: URL, callState: CallState): string;
}
