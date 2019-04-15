/// <reference types="node" />
import { EventEmitter } from "events";
import { AuthenticationResultEx } from "./AuthenticationResultEx";
import { ILogger } from "./ILogger";
import { ICacheQueryData } from "./internal/cache/CacheQueryData";
import { TokenSubjectType } from "./internal/cache/TokenCacheKey";
import { CallState } from "./internal/CallState";
import { TokenCacheItem } from "./TokenCacheItem";
import { TokenCacheNotificationArgs } from "./TokenCacheNotificationArgs";
export declare class TokenCache extends EventEmitter {
    private logger?;
    private static delimiter;
    private static expirationMarginInMinutes;
    private static defaultLogger;
    private static $defaultShared;
    private static isSameCloud;
    private $hasStateChanged;
    private tokenCacheDictionary;
    constructor(logger?: ILogger, state?: Buffer);
    static readonly defaultShared: TokenCache;
    hasStateChanged: boolean;
    readonly count: number;
    serialize(): Buffer;
    deserialize(state: Buffer): void;
    readItems(): TokenCacheItem[];
    deleteItem(item: TokenCacheItem): void;
    clear(): void;
    storeToCacheAsync(result: AuthenticationResultEx, authority: string, resource: string, clientId: string, subjectType: TokenSubjectType, callState: CallState): void;
    loadFromCacheAsync(cacheQueryData: ICacheQueryData, callState: CallState): AuthenticationResultEx;
    on(event: "beforeWrite" | "beforeAccess" | "afterAccess", listener: (args: TokenCacheNotificationArgs) => void): this;
    onBeforeWrite(args: TokenCacheNotificationArgs): void;
    onBeforeAccess(args: TokenCacheNotificationArgs): void;
    onAfterAccess(args: TokenCacheNotificationArgs): void;
    private queryCache;
    private loadSingleItemFromCache;
}
