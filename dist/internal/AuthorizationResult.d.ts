export declare enum AuthorizationStatus {
    Success = 0,
    ErrorHttp = 1,
    ProtocolError = 2,
    UserCancel = 3,
    UnknownError = 4
}
export declare class AuthorizationResult {
    status: AuthorizationStatus;
    code: string;
    error: string;
    errorDescription: string;
    cloudInstanceHost: string;
    constructor(status: AuthorizationStatus, returnedUriInput: string);
    parseAuthorizeResponse(webAuthenticationResult: string): void;
}
