"use strict";
/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const http_status_codes_1 = require("http-status-codes");
const api_client_1 = require("@wireapp/api-client");
const auth_1 = require("@wireapp/api-client/src/auth/");
const client_1 = require("@wireapp/api-client/src/client/");
const tcp_1 = require("@wireapp/api-client/src/tcp/");
const cryptobox = __importStar(require("@wireapp/cryptobox"));
const store_engine_1 = require("@wireapp/store-engine");
const events_1 = require("events");
const logdown_1 = __importDefault(require("logdown"));
const auth_2 = require("./auth/");
const broadcast_1 = require("./broadcast/");
const client_2 = require("./client/");
const connection_1 = require("./connection/");
const conversation_1 = require("./conversation/");
const cryptography_1 = require("./cryptography/");
const giphy_1 = require("./giphy/");
const notification_1 = require("./notification/");
const self_1 = require("./self/");
const team_1 = require("./team/");
const user_1 = require("./user/");
const account_1 = require("./account/");
const linkPreview_1 = require("./linkPreview");
var TOPIC;
(function (TOPIC) {
    TOPIC["ERROR"] = "Account.TOPIC.ERROR";
})(TOPIC || (TOPIC = {}));
class Account extends events_1.EventEmitter {
    /**
     * @param apiClient The apiClient instance to use in the core (will create a new new one if undefined)
     * @param storeEngineProvider Used to store info in the database (will create a inMemory engine if returns undefined)
     */
    constructor(apiClient = new api_client_1.APIClient(), { createStore = () => undefined, enableMLS = false } = {}) {
        super();
        this.handlePayload = async (payload) => {
            switch (payload.type) {
                case conversation_1.PayloadBundleType.TIMER_UPDATE: {
                    const { data: { message_timer }, conversation, } = payload;
                    const expireAfterMillis = Number(message_timer);
                    this.service.conversation.messageTimer.setConversationLevelTimer(conversation, expireAfterMillis);
                    break;
                }
            }
            this.emit(payload.type, payload);
        };
        this.handleError = (accountError) => {
            this.emit(Account.TOPIC.ERROR, accountError);
        };
        this.apiClient = apiClient;
        this.backendFeatures = this.apiClient.backendFeatures;
        this.createStore = createStore;
        this.enableMLS = enableMLS;
        apiClient.on(api_client_1.APIClient.TOPIC.COOKIE_REFRESH, async (cookie) => {
            if (cookie && this.storeEngine) {
                try {
                    await this.persistCookie(this.storeEngine, cookie);
                }
                catch (error) {
                    this.logger.error(`Failed to save cookie: ${error.message}`, error);
                }
            }
        });
        this.logger = (0, logdown_1.default)('@wireapp/core/Account', {
            logger: console,
            markdown: false,
        });
    }
    persistCookie(storeEngine, cookie) {
        const entity = { expiration: cookie.expiration, zuid: cookie.zuid };
        return storeEngine.updateOrCreate(auth_1.AUTH_TABLE_NAME, auth_1.AUTH_COOKIE_KEY, entity);
    }
    get clientId() {
        return this.apiClient.validatedClientId;
    }
    get userId() {
        return this.apiClient.validatedUserId;
    }
    async register(registration, clientType) {
        const context = await this.apiClient.register(registration, clientType);
        await this.initServices(context);
        return context;
    }
    async init(clientType, cookie, initClient = true) {
        const context = await this.apiClient.init(clientType, cookie);
        await this.initServices(context);
        if (initClient) {
            await this.initClient({ clientType });
        }
        return context;
    }
    async initServices(context) {
        this.storeEngine = await this.initEngine(context);
        const accountService = new account_1.AccountService(this.apiClient);
        const assetService = new conversation_1.AssetService(this.apiClient);
        const cryptographyService = new cryptography_1.CryptographyService(this.apiClient, this.storeEngine, {
            // We want to encrypt with fully qualified session ids, only if the backend is federated with other backends
            useQualifiedIds: this.backendFeatures.isFederated,
        });
        const clientService = new client_2.ClientService(this.apiClient, this.storeEngine, cryptographyService);
        const connectionService = new connection_1.ConnectionService(this.apiClient);
        const giphyService = new giphy_1.GiphyService(this.apiClient);
        const linkPreviewService = new linkPreview_1.LinkPreviewService(assetService);
        const conversationService = new conversation_1.ConversationService(this.apiClient, cryptographyService, {
            // We can use qualified ids to send messages as long as the backend supports federated endpoints
            useQualifiedIds: this.backendFeatures.federationEndpoints,
        });
        const notificationService = new notification_1.NotificationService(this.apiClient, cryptographyService, this.storeEngine);
        const selfService = new self_1.SelfService(this.apiClient);
        const teamService = new team_1.TeamService(this.apiClient);
        const broadcastService = new broadcast_1.BroadcastService(this.apiClient, cryptographyService);
        const userService = new user_1.UserService(this.apiClient, broadcastService, conversationService, connectionService);
        this.service = {
            account: accountService,
            asset: assetService,
            broadcast: broadcastService,
            client: clientService,
            connection: connectionService,
            conversation: conversationService,
            cryptography: cryptographyService,
            giphy: giphyService,
            linkPreview: linkPreviewService,
            notification: notificationService,
            self: selfService,
            team: teamService,
            user: userService,
        };
    }
    async login(loginData, initClient = true, clientInfo) {
        this.resetContext();
        auth_2.LoginSanitizer.removeNonPrintableCharacters(loginData);
        const context = await this.apiClient.login(loginData);
        await this.initServices(context);
        if (initClient) {
            await this.initClient(loginData, clientInfo);
        }
        return context;
    }
    async initClient(loginData, clientInfo, entropyData) {
        var _a, _b;
        if (!this.service) {
            throw new Error('Services are not set.');
        }
        try {
            const localClient = await this.loadAndValidateLocalClient();
            return { isNewClient: false, localClient };
        }
        catch (error) {
            // There was no client so we need to "create" and "register" a client
            const notFoundInDatabase = error instanceof cryptobox.error.CryptoboxError ||
                error.constructor.name === 'CryptoboxError' ||
                error instanceof store_engine_1.error.RecordNotFoundError ||
                error.constructor.name === store_engine_1.error.RecordNotFoundError.name;
            const notFoundOnBackend = ((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === http_status_codes_1.StatusCodes.NOT_FOUND;
            if (notFoundInDatabase) {
                this.logger.log(`Could not find valid client in database "${(_b = this.storeEngine) === null || _b === void 0 ? void 0 : _b.storeName}".`);
                return this.registerClient(loginData, clientInfo, entropyData);
            }
            if (notFoundOnBackend) {
                this.logger.log('Could not find valid client on backend');
                const client = await this.service.client.getLocalClient();
                const shouldDeleteWholeDatabase = client.type === client_1.ClientType.TEMPORARY;
                if (shouldDeleteWholeDatabase) {
                    this.logger.log('Last client was temporary - Deleting database');
                    if (this.storeEngine) {
                        await this.storeEngine.clearTables();
                    }
                    const context = await this.apiClient.init(loginData.clientType);
                    await this.initEngine(context);
                    return this.registerClient(loginData, clientInfo, entropyData);
                }
                this.logger.log('Last client was permanent - Deleting cryptography stores');
                await this.service.cryptography.deleteCryptographyStores();
                return this.registerClient(loginData, clientInfo, entropyData);
            }
            throw error;
        }
    }
    async loadAndValidateLocalClient() {
        await this.service.cryptography.initCryptobox();
        const loadedClient = await this.service.client.getLocalClient();
        await this.apiClient.api.client.getClient(loadedClient.id);
        this.apiClient.context.clientId = loadedClient.id;
        if (this.enableMLS) {
            this.coreCryptoClient = await this.createCoreCryptoClient(loadedClient);
        }
        return loadedClient;
    }
    async createCoreCryptoClient(client) {
        const { CoreCrypto } = await Promise.resolve().then(() => __importStar(require('./CoreCrypto')));
        return CoreCrypto.initStubbed('path/to/wasmbundle', {
            path: 'path/to/database',
            key: 'a root identity key (i.e. enclaved encryption key for this device)',
            clientId: client.id,
        });
    }
    async registerClient(loginData, clientInfo, entropyData) {
        if (!this.service) {
            throw new Error('Services are not set.');
        }
        this.logger.info(`Creating new client {mls: ${!!this.enableMLS}}`);
        const registeredClient = await this.service.client.register(loginData, clientInfo, entropyData);
        if (this.enableMLS) {
            this.coreCryptoClient = await this.createCoreCryptoClient(registeredClient);
            await this.service.client.uploadMLSKeyPackages(this.coreCryptoClient, registeredClient.id);
        }
        this.apiClient.context.clientId = registeredClient.id;
        this.logger.info('Client is created');
        await this.service.notification.initializeNotificationStream();
        await this.service.client.synchronizeClients();
        await this.service.cryptography.initCryptobox();
        return { isNewClient: true, localClient: registeredClient };
    }
    resetContext() {
        delete this.apiClient.context;
        delete this.service;
    }
    async logout() {
        await this.apiClient.logout();
        this.resetContext();
    }
    async listen(notificationHandler = this.service.notification.handleNotification) {
        if (!this.apiClient.context) {
            throw new Error('Context is not set - please login first');
        }
        this.apiClient.transport.ws.removeAllListeners(tcp_1.WebSocketClient.TOPIC.ON_MESSAGE);
        this.apiClient.transport.ws.on(tcp_1.WebSocketClient.TOPIC.ON_MESSAGE, notification => {
            notificationHandler(notification, conversation_1.PayloadBundleSource.WEBSOCKET).catch(error => {
                this.logger.error(`Failed to handle notification ID "${notification.id}": ${error.message}`, error);
            });
        });
        this.service.notification.removeAllListeners(notification_1.NotificationService.TOPIC.NOTIFICATION_ERROR);
        this.service.notification.on(notification_1.NotificationService.TOPIC.NOTIFICATION_ERROR, this.handleError);
        for (const payloadType of Object.values(conversation_1.PayloadBundleType)) {
            this.service.notification.removeAllListeners(payloadType);
            this.service.notification.on(payloadType, this.handlePayload);
        }
        const onBeforeConnect = async () => this.service.notification.handleNotificationStream(notificationHandler);
        await this.apiClient.connect(onBeforeConnect);
        return this;
    }
    async initEngine(context) {
        const clientType = context.clientType === client_1.ClientType.NONE ? '' : `@${context.clientType}`;
        const dbName = `wire@${this.apiClient.config.urls.name}@${context.userId}${clientType}`;
        this.logger.log(`Initialising store with name "${dbName}"...`);
        const openDb = async () => {
            const initializedDb = await this.createStore(dbName, context);
            if (initializedDb) {
                this.logger.log(`Initialized store with existing engine "${dbName}".`);
                return initializedDb;
            }
            this.logger.log(`Initialized store with new memory engine "${dbName}".`);
            const memoryEngine = new store_engine_1.MemoryEngine();
            await memoryEngine.init(dbName);
            return memoryEngine;
        };
        const storeEngine = await openDb();
        const cookie = auth_1.CookieStore.getCookie();
        if (cookie) {
            await this.persistCookie(storeEngine, cookie);
        }
        return storeEngine;
    }
}
exports.Account = Account;
Account.TOPIC = TOPIC;
//# sourceMappingURL=Account.js.map