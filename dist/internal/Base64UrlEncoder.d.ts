/// <reference types="node" />
export declare class Base64UrlEncoder {
    static decodeBytes(arg: string): Buffer;
    static Encode(arg: Buffer): string;
    private static base64PadCharacter;
    private static base64Character62;
    private static base64Character63;
    private static base64UrlCharacter62;
    private static base64UrlCharacter63;
    private static readonly doubleBase64PadCharacter;
}
