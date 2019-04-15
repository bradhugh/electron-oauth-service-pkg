"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalErrorCode_1 = require("../../AdalErrorCode");
const AdalServiceError_1 = require("../../AdalServiceError");
const AuthenticationResult_1 = require("../../AuthenticationResult");
const AuthenticationResultEx_1 = require("../../AuthenticationResultEx");
const Constants_1 = require("../../Constants");
const UserInfo_1 = require("../../UserInfo");
const HttpStatusCode_1 = require("../http/HttpStatusCode");
const IdToken_1 = require("./IdToken");
class TokenResponseClaim {
}
TokenResponseClaim.code = "code";
TokenResponseClaim.tokenType = "token_type";
TokenResponseClaim.accessToken = "access_token";
TokenResponseClaim.refreshToken = "refresh_token";
TokenResponseClaim.resource = "resource";
TokenResponseClaim.idToken = "id_token";
TokenResponseClaim.createdOn = "created_on";
TokenResponseClaim.expiresOn = "expires_on";
TokenResponseClaim.expiresIn = "expires_in";
TokenResponseClaim.extendedExpiresIn = "ext_expires_in";
TokenResponseClaim.error = "error";
TokenResponseClaim.errorDescription = "error_description";
TokenResponseClaim.errorCodes = "error_codes";
TokenResponseClaim.claims = "claims";
TokenResponseClaim.cloudInstanceHost = "cloud_instance_host_name";
TokenResponseClaim.authority = "authority";
exports.TokenResponseClaim = TokenResponseClaim;
class TokenResponse {
    constructor() {
        this.authority = null;
    }
    static createFromErrorResponse(webResponse) {
        let tokenResponse = new TokenResponse();
        if (!webResponse) {
            tokenResponse.error = AdalErrorCode_1.AdalErrorCode.serviceReturnedError;
            tokenResponse.errorDescription = Constants_1.AdalErrorMessage.serviceReturnedError;
            return tokenResponse;
        }
        if (!webResponse.responseString) {
            tokenResponse.error = AdalErrorCode_1.AdalErrorCode.unknown;
            tokenResponse.errorDescription = Constants_1.AdalErrorMessage.unknown;
            return tokenResponse;
        }
        try {
            const tokenRespJson = JSON.parse(webResponse.responseString);
            tokenResponse = TokenResponse.fromJson(tokenRespJson);
        }
        catch (jsonParseError) {
            tokenResponse.error = webResponse.statusCode === HttpStatusCode_1.HttpStatusCode.ServiceUnavailable
                ? AdalErrorCode_1.AdalErrorCode.serviceUnavailable : AdalErrorCode_1.AdalErrorCode.unknown;
            tokenResponse.errorDescription = webResponse.responseString;
        }
        return tokenResponse;
    }
    static fromJson(jsonResp) {
        const resp = new TokenResponse();
        resp.tokenType = jsonResp.token_type;
        resp.accessToken = jsonResp.access_token;
        resp.refreshToken = jsonResp.refresh_token;
        resp.resource = jsonResp.resource;
        resp.idTokenString = jsonResp.id_token;
        resp.createdOn = jsonResp.created_on;
        resp.expiresOn = jsonResp.expires_on;
        resp.expiresIn = jsonResp.expires_in;
        resp.extendedExpiresIn = jsonResp.ext_expires_in;
        resp.error = jsonResp.error;
        resp.errorDescription = jsonResp.error_description;
        resp.errorCodes = jsonResp.error_codes;
        resp.correlationId = jsonResp.correlation_id;
        resp.claims = jsonResp.claims;
        return resp;
    }
    getResult(callState) {
        if (this.extendedExpiresIn < this.expiresIn) {
            callState.logger.info(`ExtendedExpiresIn(${this.extendedExpiresIn}) is less than ExpiresIn(${this.expiresIn}). ` +
                "Set ExpiresIn as ExtendedExpiresIn");
            this.extendedExpiresIn = this.expiresIn;
        }
        const now = new Date();
        const result = this.getResultWithDates(new Date(now.getTime() + (this.expiresIn * 1000)), new Date(now.getTime() + (this.extendedExpiresIn * 1000)));
        return result;
    }
    getResultWithDates(expiresOn, extendedExpiresOn) {
        let resultEx = null;
        if (this.accessToken != null) {
            const result = new AuthenticationResult_1.AuthenticationResult(this.tokenType, this.accessToken, expiresOn, extendedExpiresOn);
            const idToken = IdToken_1.IdToken.parse(this.idTokenString);
            if (idToken) {
                const tenantId = idToken.tenantId;
                let uniqueId = null;
                let displayableId = null;
                if (idToken.objectId) {
                    uniqueId = idToken.objectId;
                }
                else if (idToken.subject) {
                    uniqueId = idToken.subject;
                }
                if (idToken.upn) {
                    displayableId = idToken.upn;
                }
                else if (idToken.email) {
                    displayableId = idToken.email;
                }
                const givenName = idToken.givenName;
                const familyName = idToken.familyName;
                const identityProvider = idToken.identityProvider ? idToken.identityProvider : idToken.issuer;
                let passwordExpiresOffest = null;
                const now = new Date();
                if (idToken.passwordExpiration > 0) {
                    passwordExpiresOffest = new Date(now.getTime() + (idToken.passwordExpiration * 1000));
                }
                let changePasswordUri = null;
                if (idToken.passwordChangeUrl) {
                    changePasswordUri = new URL(idToken.passwordChangeUrl);
                }
                const userInfo = new UserInfo_1.UserInfo();
                userInfo.uniqueId = uniqueId;
                userInfo.displayableId = displayableId;
                userInfo.givenName = givenName;
                userInfo.familyName = familyName;
                userInfo.identityProvider = identityProvider;
                userInfo.passwordExpiresOn = passwordExpiresOffest;
                userInfo.passwordChangeUrl = changePasswordUri;
                result.updateTenantAndUserInfo(tenantId, this.idTokenString, userInfo);
                result.authority = this.authority;
            }
            resultEx = new AuthenticationResultEx_1.AuthenticationResultEx();
            resultEx.result = result;
            resultEx.refreshToken = this.refreshToken;
            resultEx.resourceInResponse = this.resource;
        }
        else if (this.error) {
            throw new AdalServiceError_1.AdalServiceError(this.error, this.errorDescription, null, null);
        }
        else {
            throw new AdalServiceError_1.AdalServiceError(AdalErrorCode_1.AdalErrorCode.unknown, Constants_1.AdalErrorMessage.unknown, null, null);
        }
        return resultEx;
    }
}
exports.TokenResponse = TokenResponse;
//# sourceMappingURL=TokenResponse.js.map