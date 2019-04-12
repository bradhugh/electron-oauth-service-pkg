"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UserInfo {
    constructor(other) {
        if (other) {
            this.uniqueId = other.uniqueId;
            this.displayableId = other.displayableId;
            this.givenName = other.givenName;
            this.familyName = other.familyName;
            this.identityProvider = other.identityProvider;
            this.passwordExpiresOn = other.passwordExpiresOn;
            this.passwordChangeUrl = other.passwordChangeUrl;
        }
    }
}
exports.UserInfo = UserInfo;
//# sourceMappingURL=UserInfo.js.map