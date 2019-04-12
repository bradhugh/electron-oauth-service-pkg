import { ClientKey } from "./clientcreds/ClientKey";
export interface IRequestParameters {
    toString(): string;
}
export declare class DictionaryRequestParameters extends Map<string, string> implements IRequestParameters {
    extraQueryParameter: string;
    constructor(resource: string, clientKey: ClientKey);
    toString(): string;
}
export declare class StringRequestParameters implements IRequestParameters {
    private parameter;
    StringRequestParameters(stringBuilderParameter: string): void;
    toString(): string;
}
