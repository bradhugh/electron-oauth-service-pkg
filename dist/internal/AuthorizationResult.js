"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalErrorCode_1 = require("../AdalErrorCode");
const Constants_1 = require("../Constants");
const EncodingHelper_1 = require("../helpers/EncodingHelper");
const TokenResponse_1 = require("./oauth2/TokenResponse");
var AuthorizationStatus;
(function (AuthorizationStatus) {
    AuthorizationStatus[AuthorizationStatus["Success"] = 0] = "Success";
    AuthorizationStatus[AuthorizationStatus["ErrorHttp"] = 1] = "ErrorHttp";
    AuthorizationStatus[AuthorizationStatus["ProtocolError"] = 2] = "ProtocolError";
    AuthorizationStatus[AuthorizationStatus["UserCancel"] = 3] = "UserCancel";
    AuthorizationStatus[AuthorizationStatus["UnknownError"] = 4] = "UnknownError";
})(AuthorizationStatus = exports.AuthorizationStatus || (exports.AuthorizationStatus = {}));
class AuthorizationResult {
    constructor(status, returnedUriInput) {
        this.status = status;
        if (this.status === AuthorizationStatus.UserCancel) {
            this.error = AdalErrorCode_1.AdalErrorCode.authenticationCanceled;
            this.errorDescription = Constants_1.AdalErrorMessage.authenticationCanceled;
        }
        else if (this.status === AuthorizationStatus.UnknownError) {
            this.error = AdalErrorCode_1.AdalErrorCode.unknown;
            this.errorDescription = Constants_1.AdalErrorMessage.unknown;
        }
        else if (returnedUriInput) {
            this.parseAuthorizeResponse(returnedUriInput);
        }
    }
    parseAuthorizeResponse(webAuthenticationResult) {
        const resultUri = new URL(webAuthenticationResult);
        const resultData = resultUri.search;
        if (resultData) {
            const response = EncodingHelper_1.EncodingHelper.parseKeyValueList(resultData.substring(1), "&", true, true, null, false);
            if (response.has(TokenResponse_1.TokenResponseClaim.code)) {
                this.code = response.get(TokenResponse_1.TokenResponseClaim.code);
            }
            else if (webAuthenticationResult.toLowerCase().startsWith("msauth://")) {
                this.code = webAuthenticationResult;
            }
            else if (response.has(TokenResponse_1.TokenResponseClaim.error)) {
                this.error = response.get(TokenResponse_1.TokenResponseClaim.error);
                this.errorDescription = response.has(TokenResponse_1.TokenResponseClaim.errorDescription)
                    ? response.get(TokenResponse_1.TokenResponseClaim.errorDescription)
                    : null;
                this.status = AuthorizationStatus.ProtocolError;
            }
            else {
                this.error = AdalErrorCode_1.AdalErrorCode.authenticationFailed;
                this.errorDescription = Constants_1.AdalErrorMessage.authorizationServerInvalidResponse;
                this.status = AuthorizationStatus.UnknownError;
            }
            if (response.has(TokenResponse_1.TokenResponseClaim.cloudInstanceHost)) {
                this.cloudInstanceHost = response.get(TokenResponse_1.TokenResponseClaim.cloudInstanceHost);
            }
        }
        else {
            this.error = AdalErrorCode_1.AdalErrorCode.authenticationFailed;
            this.errorDescription = Constants_1.AdalErrorMessage.authorizationServerInvalidResponse;
            this.status = AuthorizationStatus.UnknownError;
        }
    }
}
exports.AuthorizationResult = AuthorizationResult;
//# sourceMappingURL=AuthorizationResult.js.map