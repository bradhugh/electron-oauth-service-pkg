"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserInfo_1 = require("./UserInfo");
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
            this.userInfo = new UserInfo_1.UserInfo(userInfo);
        }
    }
}
exports.AuthenticationResult = AuthenticationResult;
//# sourceMappingURL=AuthenticationResult.js.map