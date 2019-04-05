export declare class OAuthHeader {
    static correlationId: string;
    static requestCorrelationIdInResponse: string;
}
export declare class OAuthParameter {
    static responseType: string;
    static grantType: string;
    static clientId: string;
    static clientSecret: string;
    static clientAssertion: string;
    static clientAssertionType: string;
    static refreshToken: string;
    static redirectUri: string;
    static resource: string;
    static code: string;
    static scope: string;
    static assertion: string;
    static requestedTokenUse: string;
    static username: string;
    static password: string;
    static hasChrome: string;
    static loginHint: string;
    static correlationId: string;
    static prompt: string;
}
export declare class OAuthGrantType {
    static authorizationCode: string;
    static refreshToken: string;
    static clientCredentials: string;
    static saml11Bearer: string;
    static saml20Bearer: string;
    static jwtBearer: string;
    static password: string;
    static deviceCode: string;
}
export declare class OAuthResponseType {
    static code: string;
}
export declare class OAuthAssertionType {
    static jwtBearer: string;
}
export declare class OAuthRequestedTokenUse {
    static onBehalfOf: string;
}
export declare class OAuthError {
    static loginRequired: string;
}
export declare class OAuthValue {
    static scopeOpenId: string;
}
export declare class PromptValue {
    static login: string;
    static refreshSession: string;
    static selectAccount: string;
    static attemptNone: string;
}
