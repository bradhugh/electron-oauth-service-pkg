import { IHttpManager } from "../core/Http/HttpManager";
import { CallState } from "../internal/CallState";
export interface IInstanceDiscoveryMetadataEntry {
    preferred_network: string;
    preferred_cache: string;
    aliases: string[];
}
export interface IInstanceDiscoveryResponse {
    tenant_discovery_endpoint: string;
    metadata: IInstanceDiscoveryMetadataEntry[];
}
export declare class InstanceDiscovery {
    private httpManager;
    static defaultTrustedAuthority: string;
    static isWhitelisted(authorityHost: string): boolean;
    static formatAuthorizeEndpoint(host: string, tenant: string): string;
    private static whitelistedAuthorities;
    private static whitelistedDomains;
    private static getTenant;
    private static getHost;
    instanceCache: {
        [key: string]: IInstanceDiscoveryMetadataEntry;
    };
    constructor(httpManager: IHttpManager);
    getMetadataEntryAsync(authority: URL, validateAuthority: boolean, callState: CallState): Promise<IInstanceDiscoveryMetadataEntry>;
    discoverAsync(authority: URL, validateAuthority: boolean, callState: CallState): Promise<void>;
    addMetadataEntry(host: string): boolean;
}
