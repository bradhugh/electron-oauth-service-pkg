import { CallState } from "../internal/CallState";
export declare class EncodingHelper {
    static parseKeyValueListStrict(input: string, delimiter: string, urlDecode: boolean, lowercaseKeys: boolean, callState: CallState): Map<string, string>;
    static urlDecode(message: string): string;
    static urlEncode(message: string): string;
    static splitWithQuotes(input: string, delimiter: string): string[];
    static addKeyValueString(messageBuilder: string, key: string, value: string): string;
    static deserializeResponse<T>(response: string): T;
    static parseKeyValueList(input: string, delimiter: string, urlDecode: boolean, lowercaseKeys: boolean, callState: CallState, strict: boolean): Map<string, string>;
}
