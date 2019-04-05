import { RequestContext } from "../core/RequestContext";
export declare class EncodingHelper {
    static parseKeyValueListStrict(input: string, delimiter: string, urlDecode: boolean, lowercaseKeys: boolean, requestContext: RequestContext): {
        [key: string]: string;
    };
    static urlDecode(message: string): string;
    static urlEncode(message: string): string;
    static splitWithQuotes(input: string, delimiter: string): string[];
    static addKeyValueString(messageBuilder: string, key: string, value: string): string;
    static deserializeResponse<T>(response: string): T;
    private static parseKeyValueList;
}
