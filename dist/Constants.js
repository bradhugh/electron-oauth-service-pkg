"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AdalErrorMessage {
}
AdalErrorMessage.accessingMetadataDocumentFailed = "Accessing WS metadata exchange failed";
AdalErrorMessage.assemblyNotFoundTemplate = "Assembly required for the platform not found. Make sure assembly '{0}' exists";
AdalErrorMessage.assemblyLoadFailedTemplate = "Loading an assembly required for the platform failed. Make sure assembly for the correct platform '{0}' exists";
AdalErrorMessage.authenticationUiFailed = "The browser based authentication dialog failed to complete";
AdalErrorMessage.authorityInvalidUriFormat = "'authority' should be in Uri format";
AdalErrorMessage.authorityNotInValidList = "'authority' is not in the list of valid addresses";
AdalErrorMessage.authorityValidationFailed = "Authority validation failed";
AdalErrorMessage.nonHttpsRedirectNotSupported = "Non-HTTPS url redirect is not supported in webview";
AdalErrorMessage.authorityUriInsecure = "'authority' should use the 'https' scheme";
AdalErrorMessage.authorityUriInvalidPath = "'authority' Uri should have at least one segment in the path (i.e. https://<host>/<path>/...)";
AdalErrorMessage.authorizationServerInvalidResponse = "The authorization server returned an invalid response";
AdalErrorMessage.certificateKeySizeTooSmallTemplate = "The certificate used must have a key size of at least {0} bits";
AdalErrorMessage.emailAddressSuffixMismatch = "No identity provider email address suffix matches the provided address";
AdalErrorMessage.encodedTokenTooLong = "Encoded token size is beyond the upper limit";
AdalErrorMessage.failedToAcquireTokenSilently = "Failed to acquire token silently as no token was found in the cache. Call method AcquireToken";
AdalErrorMessage.failedToRefreshToken = "Failed to refresh access token";
AdalErrorMessage.federatedServiceReturnedErrorTemplate = "Federated service at {0} returned error: {1}";
AdalErrorMessage.identityProtocolLoginUrlNull = "The LoginUrl property in identityProvider cannot be null";
AdalErrorMessage.identityProtocolMismatch = "No identity provider matches the requested protocol";
AdalErrorMessage.identityProviderRequestFailed = "Token request made to identity provider failed. Check InnerException for more details";
AdalErrorMessage.invalidArgumentLength = "Parameter has invalid length";
AdalErrorMessage.invalidAuthenticateHeaderFormat = "Invalid authenticate header format";
AdalErrorMessage.invalidAuthorityTypeTemplate = "Invalid authority type. This method overload is not supported by '{0}'";
AdalErrorMessage.invalidCredentialType = "Invalid credential type";
AdalErrorMessage.invalidFormatParameterTemplate = "Parameter '{0}' has invalid format";
AdalErrorMessage.invalidTokenCacheKeyFormat = "Invalid token cache key format";
AdalErrorMessage.missingAuthenticateHeader = "WWW-Authenticate header was expected in the response";
AdalErrorMessage.multipleTokensMatched = "The cache contains multiple tokens satisfying the requirements. Call AcquireToken again providing more arguments (e.g. UserId)";
AdalErrorMessage.networkIsNotAvailable = "The network is down so authentication cannot proceed";
AdalErrorMessage.noDataFromSTS = "No data received from security token service";
AdalErrorMessage.nullParameterTemplate = "Parameter '{0}' cannot be null";
AdalErrorMessage.parsingMetadataDocumentFailed = "Parsing WS metadata exchange failed";
AdalErrorMessage.parsingWsTrustResponseFailed = "Parsing WS-Trust response failed";
AdalErrorMessage.passwordRequiredForManagedUserError = "Password is required for managed user";
AdalErrorMessage.redirectUriContainsFragment = "'redirectUri' must NOT include a fragment component";
AdalErrorMessage.serviceReturnedError = "Service returned error. Check InnerException for more details";
AdalErrorMessage.brokerReponseHashMismatch = "Unencrypted broker response hash did not match the expected hash";
AdalErrorMessage.stsMetadataRequestFailed = "Metadata request to Access Control service failed. Check InnerException for more details";
AdalErrorMessage.stsTokenRequestFailed = "Token request to security token service failed.  Check InnerException for more details";
AdalErrorMessage.unauthorizedHttpStatusCodeExpected = "Unauthorized Http Status Code (401) was expected in the response";
AdalErrorMessage.unauthorizedResponseExpected = "Unauthorized http response (status code 401) was expected";
AdalErrorMessage.unexpectedAuthorityValidList = "Unexpected list of valid addresses";
AdalErrorMessage.unknown = "Unknown error";
AdalErrorMessage.unknownUser = "Could not identify logged in user";
AdalErrorMessage.unknownUserType = "Unknown User Type";
AdalErrorMessage.unsupportedAuthorityValidation = "Authority validation is not supported for this type of authority";
AdalErrorMessage.unsupportedMultiRefreshToken = "This authority does not support refresh token for multiple resources. Pass null as a resource";
AdalErrorMessage.authenticationCanceled = "User canceled authentication";
AdalErrorMessage.userMismatch = "User '{0}' returned by service does not match user '{1}' in the request";
AdalErrorMessage.userCredentialAssertionTypeEmpty = "credential.AssertionType cannot be empty";
AdalErrorMessage.userInteractionRequired = "One of two conditions was encountered: "
    +
        "1. The PromptBehavior.Never flag was passed, but the constraint could not be honored, because user interaction was required. "
    +
        "2. An error occurred during a silent web authentication that prevented the http authentication flow from completing in a short enough time frame";
AdalErrorMessage.userRealmDiscoveryFailed = "User realm discovery failed";
AdalErrorMessage.wsTrustEndpointNotFoundInMetadataDocument = "WS-Trust endpoint not found in metadata document";
AdalErrorMessage.getUserNameFailed = "Failed to get user name";
AdalErrorMessage.missingFederationMetadataUrl = "Federation Metadata Url is missing for federated user. This user type is unsupported.";
AdalErrorMessage.specifyAnyUser = "If you do not need access token for any specific user, pass userId=UserIdentifier.AnyUser instead of userId=null.";
AdalErrorMessage.integratedAuthFailed = "Integrated authentication failed. You may try an alternative authentication method";
AdalErrorMessage.duplicateQueryParameterTemplate = "Duplicate query parameter '{0}' in extraQueryParameters";
AdalErrorMessage.deviceCertificateNotFoundTemplate = "Device Certificate was not found for {0}";
AdalErrorMessage.interactionRequired = "interaction_required";
exports.AdalErrorMessage = AdalErrorMessage;
//# sourceMappingURL=Constants.js.map