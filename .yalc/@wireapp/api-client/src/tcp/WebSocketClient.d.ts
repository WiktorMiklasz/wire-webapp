/// <reference types="node" />
import { EventEmitter } from 'events';
import type { ErrorEvent } from 'reconnecting-websocket';
import { HttpClient } from '../http/';
import { InvalidTokenError, MissingCookieError } from '../auth/';
import { WEBSOCKET_STATE } from './ReconnectingWebsocket';
import type { Notification } from '../notification/';
declare enum TOPIC {
    ON_ERROR = "WebSocketClient.TOPIC.ON_ERROR",
    ON_INVALID_TOKEN = "WebSocketClient.TOPIC.ON_INVALID_TOKEN",
    ON_MESSAGE = "WebSocketClient.TOPIC.ON_MESSAGE",
    ON_STATE_CHANGE = "WebSocketClient.TOPIC.ON_STATE_CHANGE"
}
export interface WebSocketClient {
    on(event: TOPIC.ON_ERROR, listener: (error: Error | ErrorEvent) => void): this;
    on(event: TOPIC.ON_INVALID_TOKEN, listener: (error: InvalidTokenError | MissingCookieError) => void): this;
    on(event: TOPIC.ON_MESSAGE, listener: (notification: Notification) => void): this;
    on(event: TOPIC.ON_STATE_CHANGE, listener: (state: WEBSOCKET_STATE) => void): this;
}
export declare class AbortHandler {
    private aborted;
    abort: () => void;
    isAborted: () => boolean;
}
export declare type OnConnect = (abortHandler: AbortHandler) => Promise<void>;
export declare class WebSocketClient extends EventEmitter {
    private clientId?;
    private isRefreshingAccessToken;
    private readonly baseUrl;
    private readonly logger;
    private readonly socket;
    private websocketState;
    client: HttpClient;
    private isSocketLocked;
    private bufferedMessages;
    private onConnect;
    private abortHandler?;
    static readonly TOPIC: typeof TOPIC;
    constructor(baseUrl: string, client: HttpClient);
    private onStateChange;
    private readonly onMessage;
    private readonly onError;
    private readonly onReconnect;
    private readonly onOpen;
    private readonly onClose;
    /**
     * Attaches all listeners to the websocket and establishes the connection.
     *
     * @param clientId
     * When provided the websocket will get messages specific to the client.
     * If omitted the websocket will receive global messages for the account.
     *
     * @param onConnect
     * Handler that is executed before the websocket is fully connected.
     * Essentially the websocket will lock before execution of this function and
     * unlocks after the execution of the handler and pushes all buffered messages.
     */
    connect(clientId?: string, onConnect?: OnConnect): Promise<WebSocketClient>;
    private refreshAccessToken;
    disconnect(reason?: string, keepClosed?: boolean): void;
    /**
     * Unlocks the websocket.
     * When unlocking the websocket all buffered messages between
     * connecting the websocket and the unlocking the websocket will be emitted.
     */
    readonly unlock: () => void;
    /**
     * Locks the websocket so messages are buffered instead of being emitted.
     * Once the websocket gets unlocked buffered messages get emitted.
     * This behaviour is needed in order to not miss any messages
     * during fetching notifications from the notification stream.
     */
    readonly lock: () => void;
    isLocked(): boolean;
    private buildWebSocketUrl;
}
export {};
