/// <reference types="node" />
import { EventEmitter } from 'events';
import type { AccessTokenData } from '../auth/';
declare enum TOPIC {
    ACCESS_TOKEN_REFRESH = "AccessTokenStore.TOPIC.ACCESS_TOKEN_REFRESH"
}
export interface AccessTokenStore {
    on(event: TOPIC.ACCESS_TOKEN_REFRESH, listener: (accessToken: AccessTokenData) => void): this;
}
export declare class AccessTokenStore extends EventEmitter {
    private readonly logger;
    static readonly TOPIC: typeof TOPIC;
    accessToken?: AccessTokenData;
    constructor();
    delete(): Promise<void>;
    updateToken(accessToken: AccessTokenData): Promise<AccessTokenData>;
}
export {};
