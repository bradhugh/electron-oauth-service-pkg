/// <reference types="node" />
export interface IPostResponse {
    headers: any;
    statusCode: number;
    statusMessage: string;
    body: Buffer;
}
export declare class Utils {
    static guidEmpty: string;
    static newGuid(): string;
    static delay(milliseconds: number): Promise<void>;
    static tokenTimeToJsDate(time: string): Date;
    static trimStart(input: string, character: string): string;
    static trimEnd(input: string, character: string): string;
    static trim(input: string, character: string): string;
    static escapeRegExp(input: string): string;
}
