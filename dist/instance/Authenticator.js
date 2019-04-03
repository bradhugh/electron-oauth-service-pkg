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
const InstanceDiscovery_1 = require("./InstanceDiscovery");
var AuthorityType;
(function (AuthorityType) {
    AuthorityType[AuthorityType["AAD"] = 0] = "AAD";
    AuthorityType[AuthorityType["ADFS"] = 1] = "ADFS";
})(AuthorityType = exports.AuthorityType || (exports.AuthorityType = {}));
class Authenticator {
    constructor(serviceBundle, authority, validateAuthority) {
        this.tenantlessTenantName = "Common";
        this._validateAuthority = false;
        this._updatedFromTemplate = false;
        this._authority = null;
        this._authorityType = AuthorityType.AAD;
        this._serviceBundle = null;
        this._authorizationUri = null;
        this._deviceCodeUri = null;
        this._tokenUri = null;
        this._userRealmUriPrefix = null;
        this._isTenantless = false;
        this._selfSignedJwtAudience = null;
        this.init(serviceBundle, authority, validateAuthority);
    }
    get validateAuthority() {
        return this._validateAuthority;
    }
    get authority() {
        return this._authority;
    }
    get authorityType() {
        return this._authorityType;
    }
    get serviceBundle() {
        return this._serviceBundle;
    }
    get authorizationUri() {
        return this._authorizationUri;
    }
    get deviceCodeUri() {
        return this._deviceCodeUri;
    }
    get userRealmUriPrefix() {
        return this._userRealmUriPrefix;
    }
    get isTenantless() {
        return this._isTenantless;
    }
    get selfSignedJwtAudience() {
        return this._selfSignedJwtAudience;
    }
    UpdateAuthorityAsync(serviceBundle, authority, requestContext) {
        return __awaiter(this, void 0, void 0, function* () {
            this.init(serviceBundle, authority, this.validateAuthority);
            this._updatedFromTemplate = false;
            yield this.UpdateFromTemplateAsync(requestContext);
        });
    }
    UpdateFromTemplateAsync(requestContext) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._updatedFromTemplate) {
                const authorityUri = new URL(this.authority);
                var host = authorityUri.host;
                const segments = authorityUri.pathname.split("/");
                const tenant = segments[segments.length - 1];
                if (this.authorityType == AuthorityType.AAD) {
                    var metadata = yield this.serviceBundle.instanceDiscovery.getMetadataEntryAsync(authorityUri, this.validateAuthority, requestContext);
                    host = metadata.preferred_network;
                }
                else {
                    this.serviceBundle.instanceDiscovery.addMetadataEntry(host);
                }
                this._authorizationUri = InstanceDiscovery_1.InstanceDiscovery.formatAuthorizeEndpoint(host, tenant);
                this._deviceCodeUri = `https://${host}/${tenant}/oauth2/devicecode`;
                this._tokenUri = `https://${host}/${tenant}/oauth2/token`;
                this._userRealmUriPrefix = `https://${host}/common/userrealm/`;
                this._isTenantless = tenant.toLowerCase() === this.tenantlessTenantName.toLowerCase();
                this._selfSignedJwtAudience = this._tokenUri;
                this._updatedFromTemplate = true;
            }
        });
    }
    static ensureUrlEndsWithForwardSlash(uri) {
        if (uri && !uri.endsWith("/")) {
            uri = uri + "/";
        }
        return uri;
    }
    static DetectAuthorityType(authority) {
        if (!authority) {
            throw new Error("authority cannot be null or empty");
        }
        const authorityUri = new URL(authority);
        if (authorityUri.protocol !== "https") {
            throw new Error("authority must be HTTPS");
        }
        const path = authorityUri.pathname.substring(1);
        if (!path) {
            throw new Error("The authority path is invalid");
        }
        const firstPath = path.substring(0, path.indexOf("/"));
        const authorityType = Authenticator.isAdfsAuthority(firstPath) ? AuthorityType.ADFS : AuthorityType.AAD;
        return authorityType;
    }
    static isAdfsAuthority(firstPath) {
        return firstPath.toLowerCase().startsWith("adfs");
    }
    init(serviceBundle, authority, validateAuthority) {
        this._authority = Authenticator.ensureUrlEndsWithForwardSlash(authority);
        this._authorityType = Authenticator.DetectAuthorityType(authority);
        if (this.authorityType !== AuthorityType.AAD && validateAuthority) {
            throw new Error("UnsupportedAuthorityValidation");
        }
        this._validateAuthority = true;
        this._serviceBundle = serviceBundle;
    }
}
exports.Authenticator = Authenticator;
//# sourceMappingURL=Authenticator.js.map