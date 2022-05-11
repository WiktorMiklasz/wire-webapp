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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APIClient = void 0;
const events_1 = require("events");
const logdown_1 = __importDefault(require("logdown"));
const auth_1 = require("./auth/");
const AccountAPI_1 = require("./account/AccountAPI");
const asset_1 = require("./asset/");
const env_1 = require("./env/");
const broadcast_1 = require("./broadcast/");
const client_1 = require("./client/");
const connection_1 = require("./connection/");
const conversation_1 = require("./conversation/");
const CookieStore_1 = require("./auth/CookieStore");
const giphy_1 = require("./giphy/");
const http_1 = require("./http/");
const notification_1 = require("./notification/");
const obfuscation_1 = require("./obfuscation/");
const tcp_1 = require("./tcp/");
const self_1 = require("./self/");
const serviceProvider_1 = require("./serviceProvider");
const services_1 = require("./services");
const team_1 = require("./team/");
const user_1 = require("./user/");
const search_1 = require("./team/search");
const parseAccessToken_1 = require("./auth/parseAccessToken");
const ScimAPI_1 = require("./team/scim/ScimAPI");
const { version } = require('../package.json');
var TOPIC;
(function (TOPIC) {
    TOPIC["ACCESS_TOKEN_REFRESH"] = "APIClient.TOPIC.ACCESS_TOKEN_REFRESH";
    TOPIC["COOKIE_REFRESH"] = "APIClient.TOPIC.COOKIE_REFRESH";
    /** Event being sent when logout is done. */
    TOPIC["ON_LOGOUT"] = "APIClient.TOPIC.ON_LOGOUT";
})(TOPIC || (TOPIC = {}));
const defaultConfig = {
    urls: env_1.Backend.PRODUCTION,
};
class APIClient extends events_1.EventEmitter {
    constructor(config) {
        super();
        this.config = Object.assign(Object.assign({}, defaultConfig), config);
        this.accessTokenStore = new auth_1.AccessTokenStore();
        this.accessTokenStore.on(auth_1.AccessTokenStore.TOPIC.ACCESS_TOKEN_REFRESH, (accessToken) => this.emit(APIClient.TOPIC.ACCESS_TOKEN_REFRESH, accessToken));
        CookieStore_1.CookieStore.emitter.on(CookieStore_1.CookieStore.TOPIC.COOKIE_REFRESH, (cookie) => this.emit(APIClient.TOPIC.COOKIE_REFRESH, cookie));
        this.logger = (0, logdown_1.default)('@wireapp/api-client/Client', {
            logger: console,
            markdown: false,
        });
        const httpClient = new http_1.HttpClient(this.config, this.accessTokenStore);
        const webSocket = new tcp_1.WebSocketClient(this.config.urls.ws, httpClient);
        const onInvalidCredentials = async (error) => {
            try {
                await this.logout({ skipLogoutRequest: true });
            }
            finally {
                // Send a guaranteed logout event to the application so that the UI can respond
                this.emit(APIClient.TOPIC.ON_LOGOUT, error);
            }
        };
        webSocket.on(tcp_1.WebSocketClient.TOPIC.ON_INVALID_TOKEN, onInvalidCredentials);
        httpClient.on(http_1.HttpClient.TOPIC.ON_INVALID_TOKEN, onInvalidCredentials);
        this.transport = {
            http: httpClient,
            ws: webSocket,
        };
        this.backendFeatures = this.computeBackendFeatures(0);
        this.api = this.configureApis(this.backendFeatures);
    }
    configureApis(backendFeatures) {
        this.logger.info('configuring APIs with config', backendFeatures);
        return {
            account: new AccountAPI_1.AccountAPI(this.transport.http),
            asset: new asset_1.AssetAPI(this.transport.http),
            auth: new auth_1.AuthAPI(this.transport.http),
            services: new services_1.ServicesAPI(this.transport.http),
            broadcast: new broadcast_1.BroadcastAPI(this.transport.http),
            client: new client_1.ClientAPI(this.transport.http),
            connection: new connection_1.ConnectionAPI(this.transport.http, backendFeatures),
            conversation: new conversation_1.ConversationAPI(this.transport.http, backendFeatures),
            giphy: new giphy_1.GiphyAPI(this.transport.http),
            notification: new notification_1.NotificationAPI(this.transport.http),
            self: new self_1.SelfAPI(this.transport.http),
            serviceProvider: new serviceProvider_1.ServiceProviderAPI(this.transport.http),
            teams: {
                conversation: new team_1.TeamConversationAPI(this.transport.http),
                feature: new team_1.FeatureAPI(this.transport.http),
                identityProvider: new team_1.IdentityProviderAPI(this.transport.http),
                invitation: new team_1.TeamInvitationAPI(this.transport.http),
                legalhold: new team_1.LegalHoldAPI(this.transport.http),
                member: new team_1.MemberAPI(this.transport.http),
                payment: new team_1.PaymentAPI(this.transport.http),
                billing: new team_1.BillingAPI(this.transport.http),
                scim: new ScimAPI_1.ScimAPI(this.transport.http),
                search: new search_1.TeamSearchAPI(this.transport.http),
                service: new team_1.ServiceAPI(this.transport.http),
                team: new team_1.TeamAPI(this.transport.http),
            },
            user: new user_1.UserAPI(this.transport.http, backendFeatures),
        };
    }
    /**
     * Will compute all the capabilities of the backend API according to the selected version and the version response payload
     * @param backendVersion The agreed used version between the client and the backend
     * @param responsePayload? The response from the server
     */
    computeBackendFeatures(backendVersion, responsePayload) {
        return {
            version: backendVersion,
            federationEndpoints: backendVersion > 0,
            isFederated: (responsePayload === null || responsePayload === void 0 ? void 0 : responsePayload.federation) || false,
        };
    }
    /**
     * Will set the APIClient to use a specific version of the API (by default uses version 0)
     * It will fetch the API Config and use the highest possible version
     * @param acceptedVersions Which version the consumer supports
     * @return The highest version that is both supported by client and backend
     */
    async useVersion(acceptedVersions) {
        if (acceptedVersions.length === 1 && acceptedVersions[0] === 0) {
            // Nothing to do since version 0 is the default one
            return this.computeBackendFeatures(0);
        }
        let backendVersions = { supported: [0] };
        try {
            backendVersions = (await this.transport.http.sendRequest({ url: '/api-version' })).data;
        }
        catch (error) { }
        const highestCommonVersion = backendVersions.supported
            .sort()
            .reverse()
            .find(version => acceptedVersions.includes(version));
        if (highestCommonVersion === undefined) {
            throw new Error(`Backend does not support requested versions [${acceptedVersions.join(', ')}] (supported versions ${backendVersions.supported.join(', ')})`);
        }
        this.backendFeatures = this.computeBackendFeatures(highestCommonVersion, backendVersions);
        this.transport.http.useVersion(this.backendFeatures.version);
        this.api = this.configureApis(this.backendFeatures);
        return this.backendFeatures;
    }
    async init(clientType = client_1.ClientType.NONE, cookie) {
        CookieStore_1.CookieStore.setCookie(cookie);
        const initialAccessToken = await this.transport.http.refreshAccessToken();
        const context = await this.createContext(initialAccessToken.user, clientType);
        await this.accessTokenStore.updateToken(initialAccessToken);
        return context;
    }
    async login(loginData) {
        if (this.context) {
            await this.logout();
        }
        const accessToken = await this.api.auth.postLogin(loginData);
        this.logger.info(`Saved initial access token. It will expire in "${accessToken.expires_in}" seconds.`, obfuscation_1.ObfuscationUtil.obfuscateAccessToken(accessToken));
        await this.accessTokenStore.updateToken(accessToken);
        return this.createContext(accessToken.user, loginData.clientType);
    }
    async loginWithToken(accessTokenString, clientType = client_1.ClientType.NONE) {
        const { userId } = (0, parseAccessToken_1.parseAccessToken)(accessTokenString);
        const accessTokenData = {
            access_token: accessTokenString,
            expires_in: 1,
            token_type: 'Bearer',
            user: userId,
        };
        await this.accessTokenStore.updateToken(accessTokenData);
        return this.createContext(userId, clientType);
    }
    async register(userAccount, clientType = client_1.ClientType.PERMANENT) {
        if (this.context) {
            await this.logout();
        }
        const user = await this.api.auth.postRegister(userAccount);
        await this.createContext(user.id, clientType);
        return this.init(clientType, CookieStore_1.CookieStore.getCookie());
    }
    async logout(options = { skipLogoutRequest: false }) {
        try {
            this.disconnect('Closed by client logout');
            if (!options.skipLogoutRequest) {
                await this.api.auth.postLogout();
            }
        }
        catch (error) {
            this.logger.warn(error);
        }
        CookieStore_1.CookieStore.deleteCookie();
        await this.accessTokenStore.delete();
        delete this.context;
    }
    connect(onConnect) {
        var _a;
        return this.transport.ws.connect((_a = this.context) === null || _a === void 0 ? void 0 : _a.clientId, onConnect);
    }
    async createContext(userId, clientType) {
        var _a;
        let selfDomain = undefined;
        try {
            const self = await this.api.self.getSelf();
            selfDomain = (_a = self.qualified_id) === null || _a === void 0 ? void 0 : _a.domain;
            this.logger.info(`Got self domain "${selfDomain}"`);
        }
        catch (error) {
            this.logger.warn('Could not get self user:', error.message);
        }
        this.context = this.context
            ? Object.assign(Object.assign({}, this.context), { clientType, domain: selfDomain }) : { clientType, userId, domain: selfDomain };
        return this.context;
    }
    disconnect(reason) {
        this.transport.ws.disconnect(reason);
    }
    get clientId() {
        var _a;
        return ((_a = this.context) === null || _a === void 0 ? void 0 : _a.clientId) || undefined;
    }
    get userId() {
        var _a;
        return ((_a = this.context) === null || _a === void 0 ? void 0 : _a.userId) || undefined;
    }
    get domain() {
        var _a;
        return ((_a = this.context) === null || _a === void 0 ? void 0 : _a.domain) || undefined;
    }
    /** Should be used in cases where the user ID is MANDATORY. */
    get validatedUserId() {
        if (this.userId) {
            return this.userId;
        }
        throw new Error('No valid user ID.');
    }
    /** Should be used in cases where the client ID is MANDATORY. */
    get validatedClientId() {
        if (this.clientId) {
            return this.clientId;
        }
        throw new Error('No valid client ID.');
    }
}
exports.APIClient = APIClient;
APIClient.BACKEND = env_1.Backend;
APIClient.TOPIC = TOPIC;
APIClient.VERSION = version;
//# sourceMappingURL=APIClient.js.map