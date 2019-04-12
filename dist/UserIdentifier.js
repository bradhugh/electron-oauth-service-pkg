"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserIdentifierType;
(function (UserIdentifierType) {
    UserIdentifierType[UserIdentifierType["UniqueId"] = 0] = "UniqueId";
    UserIdentifierType[UserIdentifierType["OptionalDisplayableId"] = 1] = "OptionalDisplayableId";
    UserIdentifierType[UserIdentifierType["RequiredDisplayableId"] = 2] = "RequiredDisplayableId";
})(UserIdentifierType = exports.UserIdentifierType || (exports.UserIdentifierType = {}));
class UserIdentifier {
    constructor(id, type) {
        this.id = id;
        this.type = type;
        if (!id) {
            throw new Error("id cannot be null");
        }
    }
    static get anyUser() {
        return UserIdentifier.anyUserSingleton;
    }
    get isAnyUser() {
        return (this.type === UserIdentifier.anyUser.type && this.id === UserIdentifier.anyUser.id);
    }
    get uniqueId() {
        return (!this.isAnyUser && this.type === UserIdentifierType.UniqueId) ? this.id : null;
    }
    get displayableId() {
        return (!this.isAnyUser && (this.type === UserIdentifierType.OptionalDisplayableId ||
            this.type === UserIdentifierType.RequiredDisplayableId))
            ? this.id
            : null;
    }
}
UserIdentifier.anyUserId = "AnyUser";
UserIdentifier.anyUserSingleton = new UserIdentifier(UserIdentifier.anyUserId, UserIdentifierType.OptionalDisplayableId);
exports.UserIdentifier = UserIdentifier;
//# sourceMappingURL=UserIdentifier.js.map