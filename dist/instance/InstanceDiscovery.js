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
class InstanceDiscovery {
    constructor(httpManager) {
        this.httpManager = httpManager;
        this.instanceCache = {};
    }
    static isWhitelisted(authorityHost) {
        return InstanceDiscovery.whitelistedAuthorities.indexOf(authorityHost) !== -1
            || InstanceDiscovery.whitelistedDomains.find((value, i, _arr) => value.endsWith(authorityHost.toLowerCase())) !== null;
    }
    static formatAuthorizeEndpoint(host, tenant) {
        return `https://${host}/${tenant}/oauth2/authorize`;
    }
    static getTenant(uri) {
        const segments = uri.pathname.split("/");
        return segments[segments.length - 1];
    }
    static getHost(uri) {
        if (InstanceDiscovery.whitelistedDomains.find((domain) => uri.host.endsWith(domain))) {
            const segments = uri.pathname.split("/");
            return `${uri.host}/${segments[1]}`;
        }
        else {
            return uri.host;
        }
    }
    getMetadataEntryAsync(authority, validateAuthority, callState) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!authority) {
                throw new Error("Authority cannot be null");
            }
            let entry = this.instanceCache[authority.host];
            if (!entry) {
                this.discoverAsync(authority, validateAuthority, callState);
                entry = this.instanceCache[authority.host];
            }
            return entry;
        });
    }
    discoverAsync(authority, validateAuthority, callState) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorityHost = InstanceDiscovery.isWhitelisted(authority.host) ?
                InstanceDiscovery.getHost(authority) : InstanceDiscovery.defaultTrustedAuthority;
            const tenant = InstanceDiscovery.formatAuthorizeEndpoint(authority.host, InstanceDiscovery.getTenant(authority));
            const instanceDiscoveryEndpoint = `https://${authorityHost}/common/discovery/instance?api-version=1.1&authorization_endpoint=${tenant}`;
            let discoveryResponse = null;
            try {
                const httpResponse = yield this.httpManager.sendGetAsync(instanceDiscoveryEndpoint, {}, callState);
                if (httpResponse.statusCode !== 200) {
                    throw new Error(`Metadata discovery failed. Status: ${httpResponse.statusCode}`);
                }
                discoveryResponse = JSON.parse(httpResponse.body);
                if (validateAuthority && !discoveryResponse.tenant_discovery_endpoint) {
                    throw new Error("Authority not in valid list");
                }
            }
            catch (error) {
                if (validateAuthority) {
                    throw new Error("Could not fetch metadata, thus could not validate authority");
                }
            }
            if (discoveryResponse && discoveryResponse.metadata) {
                for (const entry of discoveryResponse.metadata) {
                    for (const aliasedAuthority of entry.aliases) {
                        this.instanceCache[aliasedAuthority] = entry;
                    }
                }
            }
            this.addMetadataEntry(authority.host);
        });
    }
    addMetadataEntry(host) {
        if (!host) {
            throw new Error("Host cannot be null");
        }
        this.instanceCache[host] = {
            preferred_network: host,
            preferred_cache: host,
            aliases: [],
        };
        return true;
    }
}
InstanceDiscovery.defaultTrustedAuthority = "login.microsoftonline.com";
InstanceDiscovery.whitelistedAuthorities = [
    "login.windows.net",
    "login.chinacloudapi.cn",
    "login.microsoftonline.de",
    "login-us.microsoftonline.com",
    "login.microsoftonline.us",
    "login.microsoftonline.com",
];
InstanceDiscovery.whitelistedDomains = [
    "dsts.core.windows.net",
    "dsts.core.chinacloudapi.cn",
    "dsts.core.cloudapi.de",
    "dsts.core.usgovcloudapi.net",
    "dsts.core.azure-test.net",
];
exports.InstanceDiscovery = InstanceDiscovery;
//# sourceMappingURL=InstanceDiscovery.js.map