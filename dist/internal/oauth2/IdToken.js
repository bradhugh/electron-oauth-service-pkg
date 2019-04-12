"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Base64UrlEncoder_1 = require("../Base64UrlEncoder");
class IdTokenClaim {
}
IdTokenClaim.objectId = "oid";
IdTokenClaim.subject = "sub";
IdTokenClaim.tenantId = "tid";
IdTokenClaim.upn = "upn";
IdTokenClaim.email = "email";
IdTokenClaim.givenName = "given_name";
IdTokenClaim.familyName = "family_name";
IdTokenClaim.identityProvider = "idp";
IdTokenClaim.issuer = "iss";
IdTokenClaim.passwordExpiration = "pwd_exp";
IdTokenClaim.passwordChangeUrl = "pwd_url";
exports.IdTokenClaim = IdTokenClaim;
class IdToken {
    static fromJsonToken(jsonToken) {
        const idToken = new IdToken();
        idToken.objectId = jsonToken.oid;
        idToken.subject = jsonToken.sub;
        idToken.tenantId = jsonToken.tid;
        idToken.upn = jsonToken.upn;
        idToken.email = jsonToken.email;
        idToken.givenName = jsonToken.given_name;
        idToken.familyName = jsonToken.family_name;
        idToken.identityProvider = jsonToken.idp;
        idToken.issuer = jsonToken.iss;
        idToken.passwordExpiration = jsonToken.pwd_exp;
        idToken.passwordChangeUrl = jsonToken.pwd_url;
        return idToken;
    }
    static parse(idToken) {
        let idTokenBody = null;
        if (idToken) {
            const idTokenSegments = idToken.split(".");
            if (idTokenSegments.length === 3) {
                try {
                    const idTokenBytes = Base64UrlEncoder_1.Base64UrlEncoder.decodeBytes(idTokenSegments[1]);
                    const jsonIdToken = JSON.parse(idTokenBytes.toString("utf8"));
                    idTokenBody = IdToken.fromJsonToken(jsonIdToken);
                }
                catch (error) {
                }
            }
        }
        return idTokenBody;
    }
}
exports.IdToken = IdToken;
//# sourceMappingURL=IdToken.js.map