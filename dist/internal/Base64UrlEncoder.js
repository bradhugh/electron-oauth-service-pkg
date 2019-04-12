"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Base64UrlEncoder {
    static decodeBytes(arg) {
        let s = arg;
        s = s.replace(Base64UrlEncoder.base64UrlCharacter62, Base64UrlEncoder.base64Character62);
        s = s.replace(Base64UrlEncoder.base64UrlCharacter63, Base64UrlEncoder.base64Character63);
        switch (s.length % 4) {
            case 0:
                break;
            case 2:
                s += Base64UrlEncoder.doubleBase64PadCharacter;
                break;
            case 3:
                s += Base64UrlEncoder.base64PadCharacter;
                break;
            default:
                throw new Error(`Illegal base64url string! ${arg}`);
        }
        const bytes = Buffer.from(s, "base64");
        return bytes;
    }
    static Encode(arg) {
        if (!arg) {
            throw new Error("arg cannot be null");
        }
        let s = arg.toString("base64");
        s = s.split(Base64UrlEncoder.base64PadCharacter)[0];
        s = s.replace(Base64UrlEncoder.base64Character62, Base64UrlEncoder.base64UrlCharacter62);
        s = s.replace(Base64UrlEncoder.base64Character63, Base64UrlEncoder.base64UrlCharacter63);
        return s;
    }
}
Base64UrlEncoder.base64PadCharacter = "=";
Base64UrlEncoder.base64Character62 = "+";
Base64UrlEncoder.base64Character63 = "/";
Base64UrlEncoder.base64UrlCharacter62 = "-";
Base64UrlEncoder.base64UrlCharacter63 = "_";
Base64UrlEncoder.doubleBase64PadCharacter = `${Base64UrlEncoder.base64PadCharacter}${Base64UrlEncoder.base64PadCharacter}`;
exports.Base64UrlEncoder = Base64UrlEncoder;
//# sourceMappingURL=Base64UrlEncoder.js.map