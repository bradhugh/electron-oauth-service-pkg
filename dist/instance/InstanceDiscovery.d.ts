import { IHttpManager } from "../core/Http/HttpManager";
import { RequestContext } from "../core/RequestContext";
export interface InstanceDiscoveryMetadataEntry {
    preferred_network: string;
    preferred_cache: string;
    aliases: string[];
}
export interface InstanceDiscoveryResponse {
    tenant_discovery_endpoint: string;
    metadata: InstanceDiscoveryMetadataEntry[];
}
export declare class InstanceDiscovery {
    private httpManager;
    static defaultTrustedAuthority: string;
    private static whitelistedAuthorities;
    private static whitelistedDomains;
    constructor(httpManager: IHttpManager);
    static isWhitelisted(authorityHost: string): boolean;
    instanceCache: {
        [key: string]: InstanceDiscoveryMetadataEntry;
    };
    getMetadataEntryAsync(authority: URL, validateAuthority: boolean, requestContext: RequestContext): Promise<InstanceDiscoveryMetadataEntry>;
    discoverAsync(authority: URL, validateAuthority: boolean, requestContext: RequestContext): Promise<void>;
    addMetadataEntry(host: string): boolean;
    static formatAuthorizeEndpoint(host: string, tenant: string): string;
    private static getTenant;
    private static getHost;
}
