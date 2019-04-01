/// <reference types="node" />
import { TokenCacheItem } from "./TokenCacheItem";
import { AuthenticationResultEx } from "../AuthenticationResult";
import { TokenCacheKey } from "./TokenCacheKey";
import { CacheQueryData } from "./CacheQueryData";
import { EventEmitter } from "events";
export declare class TokenCacheNotificationArgs {
    tokenCache: TokenCache;
    clientId: string;
    resource: string;
    uniqueId: string;
    displayableId: string;
}
export declare enum TokenSubjectType {
    User = 0,
    Client = 1,
    UserPlusClient = 2
}
export interface KeyAndResult {
    key: TokenCacheKey;
    value: AuthenticationResultEx;
}
export declare class TokenCache extends EventEmitter {
    private tokenCacheDictionary;
    private _hasStateChanged;
    hasStateChanged: boolean;
    readItems(): TokenCacheItem[];
    clear(): void;
    storeToCache(result: AuthenticationResultEx, authority: string, resource: string, clientId: string, subjectType: TokenSubjectType): void;
    loadFromCache(cacheQueryData: CacheQueryData): AuthenticationResultEx;
    private queryCache;
    private loadSingleItemFromCache;
    private static isSameCloud;
}
