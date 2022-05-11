/// <reference types="node" />
import { EventEmitter } from 'events';
import { AccessTokenData, AuthAPI, Context, Cookie, InvalidTokenError, LoginData, RegisterData } from './auth/';
import { AccountAPI } from './account/AccountAPI';
import { AssetAPI } from './asset/';
import { BroadcastAPI } from './broadcast/';
import { ClientAPI, ClientType } from './client/';
import { ConnectionAPI } from './connection/';
import { ConversationAPI } from './conversation/';
import { GiphyAPI } from './giphy/';
import { HttpClient } from './http/';
import { NotificationAPI } from './notification/';
import { OnConnect, WebSocketClient } from './tcp/';
import { SelfAPI } from './self/';
import { ServiceProviderAPI } from './serviceProvider';
import { ServicesAPI } from './services';
import { FeatureAPI, IdentityProviderAPI, LegalHoldAPI, MemberAPI, PaymentAPI, BillingAPI, ServiceAPI, TeamAPI, TeamConversationAPI, TeamInvitationAPI } from './team/';
import { UserAPI } from './user/';
import type { Config } from './Config';
import { TeamSearchAPI } from './team/search';
import { ScimAPI } from './team/scim/ScimAPI';
declare enum TOPIC {
    ACCESS_TOKEN_REFRESH = "APIClient.TOPIC.ACCESS_TOKEN_REFRESH",
    COOKIE_REFRESH = "APIClient.TOPIC.COOKIE_REFRESH",
    /** Event being sent when logout is done. */
    ON_LOGOUT = "APIClient.TOPIC.ON_LOGOUT"
}
export interface APIClient {
    on(event: TOPIC.ON_LOGOUT, listener: (error: InvalidTokenError) => void): this;
    on(event: TOPIC.COOKIE_REFRESH, listener: (cookie?: Cookie) => void): this;
    on(event: TOPIC.ACCESS_TOKEN_REFRESH, listener: (accessToken: AccessTokenData) => void): this;
}
declare type Apis = {
    account: AccountAPI;
    asset: AssetAPI;
    auth: AuthAPI;
    broadcast: BroadcastAPI;
    client: ClientAPI;
    connection: ConnectionAPI;
    conversation: ConversationAPI;
    giphy: GiphyAPI;
    notification: NotificationAPI;
    self: SelfAPI;
    services: ServicesAPI;
    serviceProvider: ServiceProviderAPI;
    teams: {
        conversation: TeamConversationAPI;
        feature: FeatureAPI;
        identityProvider: IdentityProviderAPI;
        invitation: TeamInvitationAPI;
        legalhold: LegalHoldAPI;
        member: MemberAPI;
        payment: PaymentAPI;
        billing: BillingAPI;
        scim: ScimAPI;
        search: TeamSearchAPI;
        service: ServiceAPI;
        team: TeamAPI;
    };
    user: UserAPI;
};
/** map of all the features that the backend supports (depending on the backend api version number) */
export declare type BackendFeatures = {
    /** The actual version used to communicate with backend */
    version: number;
    /** Does the backend API support federated endpoints */
    federationEndpoints: boolean;
    /** Is the backend actually talking to other federated domains */
    isFederated: boolean;
};
export declare type BackendVersionResponse = {
    supported: number[];
    federation?: boolean;
};
export declare class APIClient extends EventEmitter {
    private readonly logger;
    api: Apis;
    private readonly accessTokenStore;
    context?: Context;
    transport: {
        http: HttpClient;
        ws: WebSocketClient;
    };
    config: Config;
    backendFeatures: BackendFeatures;
    static BACKEND: {
        PRODUCTION: import("./env/Backend").BackendData;
        STAGING: import("./env/Backend").BackendData;
    };
    static readonly TOPIC: typeof TOPIC;
    static VERSION: string;
    constructor(config?: Config);
    private configureApis;
    /**
     * Will compute all the capabilities of the backend API according to the selected version and the version response payload
     * @param backendVersion The agreed used version between the client and the backend
     * @param responsePayload? The response from the server
     */
    private computeBackendFeatures;
    /**
     * Will set the APIClient to use a specific version of the API (by default uses version 0)
     * It will fetch the API Config and use the highest possible version
     * @param acceptedVersions Which version the consumer supports
     * @return The highest version that is both supported by client and backend
     */
    useVersion(acceptedVersions: number[]): Promise<BackendFeatures>;
    init(clientType?: ClientType, cookie?: Cookie): Promise<Context>;
    login(loginData: LoginData): Promise<Context>;
    loginWithToken(accessTokenString: string, clientType?: ClientType): Promise<Context>;
    register(userAccount: RegisterData, clientType?: ClientType): Promise<Context>;
    logout(options?: {
        skipLogoutRequest: boolean;
    }): Promise<void>;
    connect(onConnect?: OnConnect): Promise<WebSocketClient>;
    private createContext;
    disconnect(reason?: string): void;
    get clientId(): string | undefined;
    get userId(): string | undefined;
    get domain(): string | undefined;
    /** Should be used in cases where the user ID is MANDATORY. */
    get validatedUserId(): string;
    /** Should be used in cases where the client ID is MANDATORY. */
    get validatedClientId(): string;
}
export {};
