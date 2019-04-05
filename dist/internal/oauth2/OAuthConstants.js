"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OAuthHeader {
}
OAuthHeader.correlationId = "client-request-id";
OAuthHeader.requestCorrelationIdInResponse = "return-client-request-id";
exports.OAuthHeader = OAuthHeader;
class OAuthParameter {
}
OAuthParameter.responseType = "response_type";
OAuthParameter.grantType = "grant_type";
OAuthParameter.clientId = "client_id";
OAuthParameter.clientSecret = "client_secret";
OAuthParameter.clientAssertion = "client_assertion";
OAuthParameter.clientAssertionType = "client_assertion_type";
OAuthParameter.refreshToken = "refresh_token";
OAuthParameter.redirectUri = "redirect_uri";
OAuthParameter.resource = "resource";
OAuthParameter.code = "code";
OAuthParameter.scope = "scope";
OAuthParameter.assertion = "assertion";
OAuthParameter.requestedTokenUse = "requested_token_use";
OAuthParameter.username = "username";
OAuthParameter.password = "password";
OAuthParameter.hasChrome = "haschrome";
OAuthParameter.loginHint = "login_hint";
OAuthParameter.correlationId = OAuthHeader.correlationId;
OAuthParameter.prompt = "prompt";
exports.OAuthParameter = OAuthParameter;
class OAuthGrantType {
}
OAuthGrantType.authorizationCode = "authorization_code";
OAuthGrantType.refreshToken = "refresh_token";
OAuthGrantType.clientCredentials = "client_credentials";
OAuthGrantType.saml11Bearer = "urn:ietf:params:oauth:grant-type:saml1_1-bearer";
OAuthGrantType.saml20Bearer = "urn:ietf:params:oauth:grant-type:saml2-bearer";
OAuthGrantType.jwtBearer = "urn:ietf:params:oauth:grant-type:jwt-bearer";
OAuthGrantType.password = "password";
OAuthGrantType.deviceCode = "device_code";
exports.OAuthGrantType = OAuthGrantType;
class OAuthResponseType {
}
OAuthResponseType.code = "code";
exports.OAuthResponseType = OAuthResponseType;
class OAuthAssertionType {
}
OAuthAssertionType.jwtBearer = "urn:ietf:params:oauth:client-assertion-type:jwt-bearer";
exports.OAuthAssertionType = OAuthAssertionType;
class OAuthRequestedTokenUse {
}
OAuthRequestedTokenUse.onBehalfOf = "on_behalf_of";
exports.OAuthRequestedTokenUse = OAuthRequestedTokenUse;
class OAuthError {
}
OAuthError.loginRequired = "login_required";
exports.OAuthError = OAuthError;
class OAuthValue {
}
OAuthValue.scopeOpenId = "openid";
exports.OAuthValue = OAuthValue;
class PromptValue {
}
PromptValue.login = "login";
PromptValue.refreshSession = "refresh_session";
PromptValue.selectAccount = "select_account";
PromptValue.attemptNone = "attempt_none";
exports.PromptValue = PromptValue;
//# sourceMappingURL=OAuthConstants.js.map