"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AdalError_1 = require("../AdalError");
const AdalErrorCode_1 = require("../AdalErrorCode");
const AdalServiceError_1 = require("../AdalServiceError");
const AdalHttpClient_1 = require("../internal/http/AdalHttpClient");
class InstanceDiscovery {
    static isWhitelisted(authorityHost) {
        return InstanceDiscovery.whitelistedAuthorities.has(authorityHost);
    }
    static async getMetadataEntryAsync(authority, validateAuthority, callState) {
        if (!authority) {
            throw new Error("authority cannot be null");
        }
        let entry = null;
        if (!InstanceDiscovery.instanceCache.has(authority.host)) {
            await InstanceDiscovery.discoverAsync(authority, validateAuthority, callState);
            if (InstanceDiscovery.instanceCache.has(authority.host)) {
                entry = InstanceDiscovery.instanceCache.get(authority.host);
            }
        }
        else {
            entry = InstanceDiscovery.instanceCache.get(authority.host);
        }
        return entry;
    }
    static formatAuthorizeEndpoint(host, tenant) {
        return `https://${host}/${tenant}/oauth2/authorize`;
    }
    static addMetadataEntry(host) {
        if (!host) {
            throw new Error("host cannot be null!");
        }
        InstanceDiscovery.instanceCache.set(host, {
            preferred_network: host,
            preferred_cache: host,
            aliases: null,
        });
        return true;
    }
    static getTenant(uri) {
        return uri.href.split("/")[1];
    }
    static async discoverAsync(authority, validateAuthority, callState) {
        const authorityHost = InstanceDiscovery.whitelistedAuthorities.has(authority.host) ?
            authority.host : InstanceDiscovery.defaultTrustedAuthority;
        const authorizeEndpoint = InstanceDiscovery.formatAuthorizeEndpoint(authority.host, InstanceDiscovery.getTenant(authority));
        const instanceDiscoveryEndpoint = `https://${authorityHost}/common/discovery/instance?api-version=1.1&authorization_endpoint=${authorizeEndpoint}`;
        const client = new AdalHttpClient_1.AdalHttpClient(instanceDiscoveryEndpoint, callState);
        let discoveryResponse = null;
        try {
            discoveryResponse = await client.getResponseAsync();
            if (validateAuthority && !discoveryResponse.tenant_discovery_endpoint) {
                throw new AdalError_1.AdalError(AdalErrorCode_1.AdalErrorCode.authorityNotInValidList, null, null);
            }
        }
        catch (error) {
            if (!(error instanceof AdalServiceError_1.AdalServiceError)) {
                throw error;
            }
            const ex = error;
            if (validateAuthority) {
                throw new AdalError_1.AdalError((ex.errorCode === "invalid_instance")
                    ? AdalErrorCode_1.AdalErrorCode.authorityNotInValidList
                    : AdalErrorCode_1.AdalErrorCode.authorityValidationFailed, null, ex);
            }
        }
        if (discoveryResponse && discoveryResponse.metadata) {
            for (const entry of discoveryResponse.metadata) {
                if (entry.aliases) {
                    for (const aliasedAuthority of entry.aliases) {
                        InstanceDiscovery.instanceCache.set(aliasedAuthority, entry);
                    }
                }
            }
        }
        InstanceDiscovery.addMetadataEntry(authority.host);
    }
}
InstanceDiscovery.defaultTrustedAuthority = "login.microsoftonline.com";
InstanceDiscovery.instanceCache = new Map();
InstanceDiscovery.whitelistedAuthorities = new Set([
    "login.windows.net",
    "login.chinacloudapi.cn",
    "login.microsoftonline.de",
    "login-us.microsoftonline.com",
    "login.microsoftonline.us",
    "login.microsoftonline.com",
]);
exports.InstanceDiscovery = InstanceDiscovery;
//# sourceMappingURL=InstanceDiscovery.js.map