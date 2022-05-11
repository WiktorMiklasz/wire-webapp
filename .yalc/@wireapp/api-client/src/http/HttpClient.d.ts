/// <reference types="node" />
import { EventEmitter } from 'events';
import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AccessTokenData, AccessTokenStore, InvalidTokenError, MissingCookieError } from '../auth/';
import { BackendError, ConnectionState } from '../http/';
import { Config } from '../Config';
declare enum TOPIC {
    ON_CONNECTION_STATE_CHANGE = "HttpClient.TOPIC.ON_CONNECTION_STATE_CHANGE",
    ON_INVALID_TOKEN = "HttpClient.TOPIC.ON_INVALID_TOKEN"
}
export interface HttpClient {
    on(event: TOPIC.ON_CONNECTION_STATE_CHANGE, listener: (state: ConnectionState) => void): this;
    on(event: TOPIC.ON_INVALID_TOKEN, listener: (error: InvalidTokenError | MissingCookieError) => void): this;
}
export declare class HttpClient extends EventEmitter {
    private readonly config;
    accessTokenStore: AccessTokenStore;
    private readonly client;
    private readonly logger;
    private connectionState;
    private readonly requestQueue;
    static readonly TOPIC: typeof TOPIC;
    private versionPrefix;
    constructor(config: Config, accessTokenStore: AccessTokenStore);
    useVersion(version: number): void;
    private updateConnectionState;
    _sendRequest<T>(config: AxiosRequestConfig, tokenAsParam?: boolean, isFirstTry?: boolean): Promise<AxiosResponse<T>>;
    static isAxiosError(errorCandidate: any): errorCandidate is AxiosError;
    static isBackendError(errorCandidate: any): errorCandidate is AxiosError<BackendError> & {
        response: BackendError;
    };
    refreshAccessToken(): Promise<AccessTokenData>;
    postAccess(expiredAccessToken?: AccessTokenData): Promise<AccessTokenData>;
    sendRequest<T>(config: AxiosRequestConfig, tokenAsParam?: boolean, isSynchronousRequest?: boolean): Promise<AxiosResponse<T>>;
    sendJSON<T>(config: AxiosRequestConfig, isSynchronousRequest?: boolean): Promise<AxiosResponse<T>>;
    sendXML<T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    sendProtocolBuffer<T>(config: AxiosRequestConfig, isSynchronousRequest?: boolean): Promise<AxiosResponse<T>>;
}
export {};
