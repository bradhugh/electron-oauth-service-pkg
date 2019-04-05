"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdalIdHelper_1 = require("../helpers/AdalIdHelper");
const OAuthConstants_1 = require("../oauth2/OAuthConstants");
class PlatformInformationBase {
    getAssemblyFileVersionAttribute() {
        return AdalIdHelper_1.AdalIdHelper.versionNotDetermined;
    }
    isUserLocalAsync(callState) {
        return __awaiter(this, void 0, void 0, function* () {
            return false;
        });
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
    ValidateRedirectUri(redirectUri, callState) {
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