"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=AuthenticationResult.js.map