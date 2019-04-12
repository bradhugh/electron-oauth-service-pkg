"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationResult_1 = require("./AuthenticationResult");
const UserInfo_1 = require("./UserInfo");
class AuthenticationResultEx {
    static staticClone(clone, source) {
        clone.userAssertionHash = source.userAssertionHash;
        clone.error = source.error;
        clone.refreshToken = source.refreshToken;
        clone.resourceInResponse = source.resourceInResponse;
        clone.result = new AuthenticationResult_1.AuthenticationResult(source.result.accessTokenType, source.result.accessToken, source.result.expiresOn, source.result.extendedExpiresOn);
        clone.result.extendedLifeTimeToken = source.result.extendedLifeTimeToken;
        clone.result.idToken = source.result.idToken;
        clone.result.tenantId = source.result.tenantId;
        clone.result.userInfo = new UserInfo_1.UserInfo(source.result.userInfo);
    }
    static deserialize(serializedObject) {
        const deserialized = JSON.parse(serializedObject, (key, value) => {
            switch (key) {
                case "expiresOn":
                case "extendedExpiresOn":
                    return new Date(value);
            }
            return value;
        });
        const clone = new AuthenticationResultEx();
        AuthenticationResultEx.staticClone(clone, deserialized);
        return clone;
    }
    serialize() {
        return JSON.stringify(this);
    }
    clone() {
        const cloned = new AuthenticationResultEx();
        AuthenticationResultEx.staticClone(cloned, this);
        return cloned;
    }
}
exports.AuthenticationResultEx = AuthenticationResultEx;
//# sourceMappingURL=AuthenticationResultEx.js.map