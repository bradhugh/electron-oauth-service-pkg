/// <reference types="node" />
import { EventEmitter } from "events";
import { AuthenticationResultEx } from "./AuthenticationResultEx";
import { CacheQueryData } from "./internal/cache/CacheQueryData";
import { TokenSubjectType } from "./internal/cache/TokenCacheKey";
import { TokenCacheItem } from "./TokenCacheItem";
export declare class TokenCache extends EventEmitter {
    private static delimiter;
    private static expirationMarginInMinutes;
    private static $defaultShared;
    private static isSameCloud;
    private $hasStateChanged;
    private tokenCacheDictionary;
    constructor(state?: Buffer);
    static readonly defaultShared: TokenCache;
    hasStateChanged: boolean;
    readonly count: number;
    serialize(): Buffer;
    deserialize(state: Buffer): void;
    readItems(): TokenCacheItem[];
    deleteItem(item: TokenCacheItem): void;
    clear(): void;
    storeToCache(result: AuthenticationResultEx, authority: string, resource: string, clientId: string, subjectType: TokenSubjectType): void;
    loadFromCache(cacheQueryData: CacheQueryData): AuthenticationResultEx;
    logCache(): void;
    private queryCache;
    private loadSingleItemFromCache;
}
