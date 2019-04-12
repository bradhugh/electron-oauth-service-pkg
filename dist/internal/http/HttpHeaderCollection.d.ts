export interface IHttpHeader {
    name: string;
    value: string;
}
export declare class HttpHeaderCollection {
    static fromElectronHeaders(headers: any): HttpHeaderCollection;
    private headerDictionary;
    get(headerName: string): string;
    getValues(headerName: string): string[];
    getFirst(headerName: string): string;
    contains(headerName: string): boolean;
    add(headerName: string, headerValue: string): void;
    getAllEntries(): IHttpHeader[];
}
