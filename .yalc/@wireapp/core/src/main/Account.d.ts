/// <reference types="node" />
import { APIClient, BackendFeatures } from '@wireapp/api-client';
import type { RegisterData } from '@wireapp/api-client/src/auth';
import { Context, Cookie, LoginData } from '@wireapp/api-client/src/auth/';
import { ClientType, RegisteredClient } from '@wireapp/api-client/src/client/';
import * as Events from '@wireapp/api-client/src/event';
import { CRUDEngine } from '@wireapp/store-engine';
import { EventEmitter } from 'events';
import { BroadcastService } from './broadcast/';
import { ClientInfo, ClientService } from './client/';
import { ConnectionService } from './connection/';
import { AssetService, ConversationService, PayloadBundleType } from './conversation/';
import * as OtrMessage from './conversation/message/OtrMessage';
import * as UserMessage from './conversation/message/UserMessage';
import type { CoreError } from './CoreError';
import { CryptographyService } from './cryptography/';
import { GiphyService } from './giphy/';
import { NotificationHandler, NotificationService } from './notification/';
import { SelfService } from './self/';
import { TeamService } from './team/';
import { UserService } from './user/';
import { AccountService } from './account/';
import { LinkPreviewService } from './linkPreview';
declare enum TOPIC {
    ERROR = "Account.TOPIC.ERROR"
}
export interface Account {
    on(event: PayloadBundleType.ASSET, listener: (payload: OtrMessage.FileAssetMessage | OtrMessage.ImageAssetMessage) => void): this;
    on(event: PayloadBundleType.BUTTON_ACTION, listener: (payload: OtrMessage.ButtonActionMessage) => void): this;
    on(event: PayloadBundleType.ASSET_ABORT, listener: (payload: OtrMessage.FileAssetAbortMessage) => void): this;
    on(event: PayloadBundleType.ASSET_IMAGE, listener: (payload: OtrMessage.ImageAssetMessage) => void): this;
    on(event: PayloadBundleType.ASSET_META, listener: (payload: OtrMessage.FileAssetMetaDataMessage) => void): this;
    on(event: PayloadBundleType.CALL, listener: (payload: OtrMessage.CallMessage) => void): this;
    on(event: PayloadBundleType.CLIENT_ACTION, listener: (payload: OtrMessage.ResetSessionMessage) => void): this;
    on(event: PayloadBundleType.CLIENT_ADD, listener: (payload: UserMessage.UserClientAddMessage) => void): this;
    on(event: PayloadBundleType.CLIENT_REMOVE, listener: (payload: UserMessage.UserClientRemoveMessage) => void): this;
    on(event: PayloadBundleType.CONFIRMATION, listener: (payload: OtrMessage.ConfirmationMessage) => void): this;
    on(event: PayloadBundleType.CONNECTION_REQUEST, listener: (payload: UserMessage.UserConnectionMessage) => void): this;
    on(event: PayloadBundleType.USER_UPDATE, listener: (payload: UserMessage.UserUpdateMessage) => void): this;
    on(event: PayloadBundleType.CONVERSATION_CLEAR, listener: (payload: OtrMessage.ClearConversationMessage) => void): this;
    on(event: PayloadBundleType.CONVERSATION_RENAME, listener: (payload: Events.ConversationRenameEvent) => void): this;
    on(event: PayloadBundleType.LOCATION, listener: (payload: OtrMessage.LocationMessage) => void): this;
    on(event: PayloadBundleType.MEMBER_JOIN, listener: (payload: Events.TeamMemberJoinEvent) => void): this;
    on(event: PayloadBundleType.MESSAGE_DELETE, listener: (payload: OtrMessage.DeleteMessage) => void): this;
    on(event: PayloadBundleType.MESSAGE_EDIT, listener: (payload: OtrMessage.EditedTextMessage) => void): this;
    on(event: PayloadBundleType.MESSAGE_HIDE, listener: (payload: OtrMessage.HideMessage) => void): this;
    on(event: PayloadBundleType.PING, listener: (payload: OtrMessage.PingMessage) => void): this;
    on(event: PayloadBundleType.REACTION, listener: (payload: OtrMessage.ReactionMessage) => void): this;
    on(event: PayloadBundleType.TEXT, listener: (payload: OtrMessage.TextMessage) => void): this;
    on(event: PayloadBundleType.TIMER_UPDATE, listener: (payload: Events.ConversationMessageTimerUpdateEvent) => void): this;
    on(event: PayloadBundleType.TYPING, listener: (payload: Events.ConversationTypingEvent) => void): this;
    on(event: PayloadBundleType.UNKNOWN, listener: (payload: any) => void): this;
    on(event: TOPIC.ERROR, listener: (payload: CoreError) => void): this;
}
export declare type CreateStoreFn = (storeName: string, context: Context) => undefined | Promise<CRUDEngine | undefined>;
export declare class Account extends EventEmitter {
    private readonly apiClient;
    private readonly logger;
    private readonly createStore;
    private storeEngine?;
    private readonly enableMLS;
    private coreCryptoClient?;
    static readonly TOPIC: typeof TOPIC;
    service?: {
        account: AccountService;
        asset: AssetService;
        broadcast: BroadcastService;
        client: ClientService;
        connection: ConnectionService;
        conversation: ConversationService;
        cryptography: CryptographyService;
        giphy: GiphyService;
        linkPreview: LinkPreviewService;
        notification: NotificationService;
        self: SelfService;
        team: TeamService;
        user: UserService;
    };
    backendFeatures: BackendFeatures;
    /**
     * @param apiClient The apiClient instance to use in the core (will create a new new one if undefined)
     * @param storeEngineProvider Used to store info in the database (will create a inMemory engine if returns undefined)
     */
    constructor(apiClient?: APIClient, { createStore, enableMLS }?: {
        createStore?: CreateStoreFn;
        enableMLS?: boolean;
    });
    private persistCookie;
    get clientId(): string;
    get userId(): string;
    register(registration: RegisterData, clientType: ClientType): Promise<Context>;
    init(clientType: ClientType, cookie?: Cookie, initClient?: boolean): Promise<Context>;
    initServices(context: Context): Promise<void>;
    login(loginData: LoginData, initClient?: boolean, clientInfo?: ClientInfo): Promise<Context>;
    initClient(loginData: LoginData, clientInfo?: ClientInfo, entropyData?: Uint8Array): Promise<{
        isNewClient: boolean;
        localClient: RegisteredClient;
    }>;
    loadAndValidateLocalClient(): Promise<RegisteredClient>;
    private createCoreCryptoClient;
    private registerClient;
    private resetContext;
    logout(): Promise<void>;
    listen(notificationHandler?: NotificationHandler): Promise<Account>;
    private readonly handlePayload;
    private readonly handleError;
    private initEngine;
}
export {};
