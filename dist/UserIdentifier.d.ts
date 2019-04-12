export declare enum UserIdentifierType {
    UniqueId = 0,
    OptionalDisplayableId = 1,
    RequiredDisplayableId = 2
}
export declare class UserIdentifier {
    id: string;
    type: UserIdentifierType;
    static readonly anyUser: UserIdentifier;
    private static anyUserId;
    private static anyUserSingleton;
    constructor(id: string, type: UserIdentifierType);
    readonly isAnyUser: boolean;
    readonly uniqueId: string;
    readonly displayableId: string;
}
