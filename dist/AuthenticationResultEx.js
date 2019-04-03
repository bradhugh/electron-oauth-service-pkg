"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationResult_1 = require("./AuthenticationResult");
class AuthenticationResultEx {
    static deserialize(serializedObject) {
        return JSON.parse(serializedObject);
    }
    serialize() {
        return JSON.stringify(this);
    }
    clone() {
        const cloned = new AuthenticationResultEx();
        cloned.userAssertionHash = this.userAssertionHash;
        cloned.error = this.error;
        cloned.refreshToken = this.refreshToken;
        cloned.resourceInResponse = this.resourceInResponse;
        cloned.result = new AuthenticationResult_1.AuthenticationResult(this.result.accessTokenType, this.result.accessToken, this.result.expiresOn, this.result.extendedExpiresOn);
        cloned.result.extendedLifeTimeToken = this.result.extendedLifeTimeToken;
        cloned.result.idToken = this.result.idToken;
        cloned.result.tenantId = this.result.tenantId;
        cloned.result.userInfo = this.result.userInfo;
        return cloned;
    }
}
exports.AuthenticationResultEx = AuthenticationResultEx;
//# sourceMappingURL=AuthenticationResultEx.js.map