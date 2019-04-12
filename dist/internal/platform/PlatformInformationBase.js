"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const OAuthConstants_1 = require("../oauth2/OAuthConstants");
class PlatformInformationBase {
    getAssemblyFileVersionAttribute() {
        return "0.0.0.0";
    }
    async isUserLocalAsync(callState) {
        return false;
    }
    isDomainJoined() {
        return false;
    }
    addPromptBehaviorQueryParameter(parameters, authorizationRequestParameters) {
        authorizationRequestParameters.set(OAuthConstants_1.OAuthParameter.prompt, OAuthConstants_1.PromptValue.login);
    }
    getCacheLoadPolicy(parameters) {
        return true;
    }
    validateRedirectUri(redirectUri, callState) {
        if (!redirectUri) {
            throw new Error("redirectUri cannot be null");
        }
        return redirectUri;
    }
    getRedirectUriAsString(redirectUri, callState) {
        return redirectUri.href;
    }
}
exports.PlatformInformationBase = PlatformInformationBase;
//# sourceMappingURL=PlatformInformationBase.js.map