import { RequestContext } from "../core/RequestContext";
export declare class EncodingHelper {
    static parseKeyValueListStrict(input: string, delimiter: string, urlDecode: boolean, lowercaseKeys: boolean, requestContext: RequestContext): {
        [key: string]: string;
    };
    private static parseKeyValueList;
    static urlDecode(message: string): string;
    static splitWithQuotes(input: string, delimiter: string): string[];
}
