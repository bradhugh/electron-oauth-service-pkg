"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Utils_1 = require("../Utils");
const InstanceDiscovery_1 = require("./InstanceDiscovery");
var AuthorityType;
(function (AuthorityType) {
    AuthorityType[AuthorityType["AAD"] = 0] = "AAD";
    AuthorityType[AuthorityType["ADFS"] = 1] = "ADFS";
})(AuthorityType = exports.AuthorityType || (exports.AuthorityType = {}));
class Authenticator {
    constructor(authority, validateAuthority) {
        this.correlationId = Utils_1.Utils.guidEmpty;
        this.tenantlessTenantName = "Common";
        this._validateAuthority = false;
        this._updatedFromTemplate = false;
        this._authority = null;
        this._authorityType = AuthorityType.AAD;
        this._authorizationUri = null;
        this._deviceCodeUri = null;
        this._tokenUri = null;
        this._userRealmUriPrefix = null;
        this._isTenantless = false;
        this._selfSignedJwtAudience = null;
        this.init(authority, validateAuthority);
    }
    static ensureUrlEndsWithForwardSlash(uri) {
        if (uri && !uri.endsWith("/")) {
            uri = uri + "/";
        }
        return uri;
    }
    static detectAuthorityType(authority) {
        if (!authority) {
            throw new Error("authority cannot be null or empty");
        }
        const authorityUri = new URL(authority);
        if (authorityUri.protocol !== "https:") {
            throw new Error(`authority must be HTTPS, not '${authorityUri.protocol}'`);
        }
        const path = authorityUri.pathname.substring(1);
        if (!path) {
            throw new Error("The authority path is invalid");
        }
        const firstPath = path.substring(0, path.indexOf("/"));
        const authorityType = Authenticator.isAdfsAuthority(firstPath) ?
            AuthorityType.ADFS : AuthorityType.AAD;
        return authorityType;
    }
    static isAdfsAuthority(firstPath) {
        return firstPath.toLowerCase().startsWith("adfs");
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
    get tokenUri() {
        return this._tokenUri;
    }
    getAuthorityHost() {
        return !!this.authority ? new URL(this.authority).host : null;
    }
    updateTenantId(tenantId) {
        if (this.isTenantless && tenantId) {
            this.replaceTenantlessTenant(tenantId);
            this._updatedFromTemplate = false;
        }
    }
    async updateAuthorityAsync(authority, callState) {
        this.init(authority, this.validateAuthority);
        this._updatedFromTemplate = false;
        await this.updateFromTemplateAsync(callState);
    }
    async updateFromTemplateAsync(callState) {
        callState.logger.verbose(`updateFromTemplateAsync enter. updatedFromTemplate: ${this._updatedFromTemplate}`);
        if (!this._updatedFromTemplate) {
            const authorityUri = new URL(this.authority);
            let host = authorityUri.host;
            const path = authorityUri.pathname.substring(1);
            const tenant = path.substring(0, path.indexOf("/"));
            if (this.authorityType === AuthorityType.AAD) {
                const metadata = await InstanceDiscovery_1.InstanceDiscovery.getMetadataEntryAsync(authorityUri, this.validateAuthority, callState);
                host = metadata.preferred_network;
            }
            else {
                InstanceDiscovery_1.InstanceDiscovery.addMetadataEntry(host);
            }
            this._authorizationUri = InstanceDiscovery_1.InstanceDiscovery.formatAuthorizeEndpoint(host, tenant);
            this._deviceCodeUri = `https://${host}/${tenant}/oauth2/devicecode`;
            this._tokenUri = `https://${host}/${tenant}/oauth2/token`;
            this._userRealmUriPrefix = `https://${host}/common/userrealm/`;
            this._isTenantless = tenant.toLowerCase() === this.tenantlessTenantName.toLowerCase();
            this._selfSignedJwtAudience = this._tokenUri;
            this._updatedFromTemplate = true;
        }
        callState.logger.verbose("updateFromTemplateAsync exit.");
    }
    init(authority, validateAuthority) {
        this._authority = Authenticator.ensureUrlEndsWithForwardSlash(authority);
        this._authorityType = Authenticator.detectAuthorityType(authority);
        if (this.authorityType !== AuthorityType.AAD && validateAuthority) {
            throw new Error("UnsupportedAuthorityValidation");
        }
        this._validateAuthority = true;
    }
    replaceTenantlessTenant(tenantId) {
        this._authority = this.authority.replace(Authenticator.tenantNameRegex, tenantId);
    }
}
Authenticator.tenantNameRegex = /common/i;
exports.Authenticator = Authenticator;
//# sourceMappingURL=Authenticator.js.map