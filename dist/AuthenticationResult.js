"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserInfo {
}
exports.UserInfo = UserInfo;
class AuthenticationResult {
    constructor(accessTokenType, accessToken, expiresOn, extendedExpiresOn) {
        this.accessTokenType = accessTokenType;
        this.accessToken = accessToken;
        this.expiresOn = expiresOn;
        if (extendedExpiresOn) {
            this.extendedExpiresOn = extendedExpiresOn;
        }
        else {
            this.extendedExpiresOn = expiresOn;
        }
    }
    updateTenantAndUserInfo(tenantId, idToken, userInfo) {
        this.tenantId = tenantId;
        this.idToken = idToken;
        if (userInfo) {
            this.userInfo = userInfo;
        }
    }
}
exports.AuthenticationResult = AuthenticationResult;
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
        cloned.result = new AuthenticationResult(this.result.accessTokenType, this.result.accessToken, this.result.expiresOn, this.result.extendedExpiresOn);
        cloned.result.extendedLifeTimeToken = this.result.extendedLifeTimeToken;
        cloned.result.idToken = this.result.idToken;
        cloned.result.tenantId = this.result.tenantId;
        cloned.result.userInfo = this.result.userInfo;
        return cloned;
    }
}
exports.AuthenticationResultEx = AuthenticationResultEx;
//# sourceMappingURL=AuthenticationResult.js.map