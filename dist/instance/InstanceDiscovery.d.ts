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
    static defaultTrustedAuthority: string;
    static instanceCache: Map<string, IInstanceDiscoveryMetadataEntry>;
    static isWhitelisted(authorityHost: string): boolean;
    static getMetadataEntryAsync(authority: URL, validateAuthority: boolean, callState: CallState): Promise<IInstanceDiscoveryMetadataEntry>;
    static formatAuthorizeEndpoint(host: string, tenant: string): string;
    static addMetadataEntry(host: string): boolean;
    private static whitelistedAuthorities;
    private static getTenant;
    private static discoverAsync;
}
