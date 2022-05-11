/// <reference types="node" />
import { EventEmitter } from 'events';
import type { Cookie } from './Cookie';
declare enum TOPIC {
    COOKIE_REFRESH = "CookieStore.TOPIC.COOKIE_REFRESH"
}
export declare class CookieStore {
    private static cookie?;
    static emitter: EventEmitter;
    static readonly TOPIC: typeof TOPIC;
    static getCookie(): Cookie | undefined;
    private static emit;
    static setCookie(cookie?: Cookie): void;
    static deleteCookie(): void;
}
export {};
