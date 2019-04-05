"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalErrorCode_1 = require("./AdalErrorCode");
const Constants_1 = require("./Constants");
var ErrorFormat;
(function (ErrorFormat) {
    ErrorFormat[ErrorFormat["Json"] = 0] = "Json";
    ErrorFormat[ErrorFormat["Other"] = 1] = "Other";
})(ErrorFormat = exports.ErrorFormat || (exports.ErrorFormat = {}));
class AdalError extends Error {
    constructor(errorCode, message, innerError) {
        super(message);
        this.errorCode = errorCode;
        this.message = message;
        this.innerError = innerError;
    }
    static getErrorMessage(errorCode) {
        let message = null;
        switch (errorCode) {
            case AdalErrorCode_1.AdalErrorCode.invalidCredentialType:
                message = Constants_1.AdalErrorMessage.invalidCredentialType;
                break;
            case AdalErrorCode_1.AdalErrorCode.identityProtocolLoginUrlNull:
                message = Constants_1.AdalErrorMessage.identityProtocolLoginUrlNull;
                break;
            case AdalErrorCode_1.AdalErrorCode.identityProtocolMismatch:
                message = Constants_1.AdalErrorMessage.identityProtocolMismatch;
                break;
            case AdalErrorCode_1.AdalErrorCode.emailAddressSuffixMismatch:
                message = Constants_1.AdalErrorMessage.emailAddressSuffixMismatch;
                break;
            case AdalErrorCode_1.AdalErrorCode.identityProviderRequestFailed:
                message = Constants_1.AdalErrorMessage.identityProviderRequestFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.stsTokenRequestFailed:
                message = Constants_1.AdalErrorMessage.stsTokenRequestFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.encodedTokenTooLong:
                message = Constants_1.AdalErrorMessage.encodedTokenTooLong;
                break;
            case AdalErrorCode_1.AdalErrorCode.stsMetadataRequestFailed:
                message = Constants_1.AdalErrorMessage.stsMetadataRequestFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.authorityNotInValidList:
                message = Constants_1.AdalErrorMessage.authorityNotInValidList;
                break;
            case AdalErrorCode_1.AdalErrorCode.unknownUserType:
                message = Constants_1.AdalErrorMessage.unknownUserType;
                break;
            case AdalErrorCode_1.AdalErrorCode.unknownUser:
                message = Constants_1.AdalErrorMessage.unknownUser;
                break;
            case AdalErrorCode_1.AdalErrorCode.userRealmDiscoveryFailed:
                message = Constants_1.AdalErrorMessage.userRealmDiscoveryFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.accessingWsMetadataExchangeFailed:
                message = Constants_1.AdalErrorMessage.accessingMetadataDocumentFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.parsingWsMetadataExchangeFailed:
                message = Constants_1.AdalErrorMessage.parsingMetadataDocumentFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.wsTrustEndpointNotFoundInMetadataDocument:
                message = Constants_1.AdalErrorMessage.wsTrustEndpointNotFoundInMetadataDocument;
                break;
            case AdalErrorCode_1.AdalErrorCode.parsingWsTrustResponseFailed:
                message = Constants_1.AdalErrorMessage.parsingWsTrustResponseFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.authenticationCanceled:
                message = Constants_1.AdalErrorMessage.authenticationCanceled;
                break;
            case AdalErrorCode_1.AdalErrorCode.networkNotAvailable:
                message = Constants_1.AdalErrorMessage.networkIsNotAvailable;
                break;
            case AdalErrorCode_1.AdalErrorCode.authenticationUiFailed:
                message = Constants_1.AdalErrorMessage.authenticationUiFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.userInteractionRequired:
                message = Constants_1.AdalErrorMessage.userInteractionRequired;
                break;
            case AdalErrorCode_1.AdalErrorCode.missingFederationMetadataUrl:
                message = Constants_1.AdalErrorMessage.missingFederationMetadataUrl;
                break;
            case AdalErrorCode_1.AdalErrorCode.integratedAuthFailed:
                message = Constants_1.AdalErrorMessage.integratedAuthFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.unauthorizedResponseExpected:
                message = Constants_1.AdalErrorMessage.unauthorizedResponseExpected;
                break;
            case AdalErrorCode_1.AdalErrorCode.multipleTokensMatched:
                message = Constants_1.AdalErrorMessage.multipleTokensMatched;
                break;
            case AdalErrorCode_1.AdalErrorCode.passwordRequiredForManagedUserError:
                message = Constants_1.AdalErrorMessage.passwordRequiredForManagedUserError;
                break;
            case AdalErrorCode_1.AdalErrorCode.getUserNameFailed:
                message = Constants_1.AdalErrorMessage.getUserNameFailed;
                break;
            case AdalErrorCode_1.AdalErrorCode.interactionRequired:
                message = Constants_1.AdalErrorMessage.interactionRequired;
                break;
            default:
                message = Constants_1.AdalErrorMessage.unknown;
                break;
        }
        return `${errorCode}: ${message}`;
    }
    toString() {
        return `${this.message}\nErrorCode: ${this.errorCode}`;
    }
}
exports.AdalError = AdalError;
//# sourceMappingURL=AdalError.js.map