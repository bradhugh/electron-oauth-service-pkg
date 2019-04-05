export declare class HttpHeaderCollection {
    private headerDictionary;
    get(headerName: string): string;
    getValues(headerName: string): string[];
    getFirst(headerName: string): string;
    contains(headerName: string): boolean;
    add(headerName: string, headerValue: string): void;
}
