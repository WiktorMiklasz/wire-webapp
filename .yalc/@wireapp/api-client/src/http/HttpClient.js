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
exports.HttpClient = void 0;
const events_1 = require("events");
const priority_queue_1 = require("@wireapp/priority-queue");
const commons_1 = require("@wireapp/commons");
const axios_1 = __importDefault(require("axios"));
const logdown_1 = __importDefault(require("logdown"));
const auth_1 = require("../auth/");
const http_1 = require("../http/");
const obfuscation_1 = require("../obfuscation/");
const cookie_1 = require("../shims/node/cookie");
const axios_retry_1 = __importStar(require("axios-retry"));
var TOPIC;
(function (TOPIC) {
    TOPIC["ON_CONNECTION_STATE_CHANGE"] = "HttpClient.TOPIC.ON_CONNECTION_STATE_CHANGE";
    TOPIC["ON_INVALID_TOKEN"] = "HttpClient.TOPIC.ON_INVALID_TOKEN";
})(TOPIC || (TOPIC = {}));
const FILE_SIZE_100_MB = 104857600;
class HttpClient extends events_1.EventEmitter {
    constructor(config, accessTokenStore) {
        super();
        this.config = config;
        this.accessTokenStore = accessTokenStore;
        this.versionPrefix = '';
        this.client = axios_1.default.create({
            baseURL: this.config.urls.rest,
        });
        (0, axios_retry_1.default)(this.client, {
            retries: Infinity,
            retryDelay: axios_retry_1.default.exponentialDelay,
            retryCondition: (error) => {
                const { response, request } = error;
                const isNetworkError = !response && request && !Object.keys(request).length;
                if (isNetworkError) {
                    this.logger.warn('Disconnected from backend');
                    this.updateConnectionState(http_1.ConnectionState.DISCONNECTED);
                    return true;
                }
                return (0, axios_retry_1.isNetworkOrIdempotentRequestError)(error);
            },
            shouldResetTimeout: true,
        });
        this.connectionState = http_1.ConnectionState.UNDEFINED;
        this.logger = (0, logdown_1.default)('@wireapp/api-client/http/HttpClient', {
            logger: console,
            markdown: false,
        });
        this.requestQueue = new priority_queue_1.PriorityQueue({
            maxRetries: 0,
            retryDelay: commons_1.TimeUtil.TimeInMillis.SECOND,
        });
    }
    useVersion(version) {
        this.versionPrefix = version > 0 ? `/v${version}` : '';
    }
    updateConnectionState(state) {
        if (this.connectionState !== state) {
            this.connectionState = state;
            this.emit(HttpClient.TOPIC.ON_CONNECTION_STATE_CHANGE, this.connectionState);
        }
    }
    async _sendRequest(config, tokenAsParam = false, isFirstTry = true) {
        var _a, _b;
        if (this.accessTokenStore.accessToken) {
            const { token_type, access_token } = this.accessTokenStore.accessToken;
            if (tokenAsParam) {
                config.params = Object.assign(Object.assign({}, config.params), { access_token });
            }
            else {
                config.headers = Object.assign(Object.assign({}, config.headers), { Authorization: `${token_type} ${access_token}` });
            }
        }
        try {
            const response = await this.client.request(Object.assign(Object.assign({}, config), { 
                // We want to prefix all urls, except the ones with cookies which are attached to unprefixed urls
                url: config.withCredentials ? config.url : `${this.versionPrefix}${config.url}`, maxBodyLength: FILE_SIZE_100_MB, maxContentLength: FILE_SIZE_100_MB }));
            this.updateConnectionState(http_1.ConnectionState.CONNECTED);
            return response;
        }
        catch (error) {
            const retryWithTokenRefresh = async () => {
                this.logger.warn(`Access token refresh triggered for "${config.method}" request to "${config.url}".`);
                await this.refreshAccessToken();
                config['axios-retry'] = {
                    retries: 0,
                };
                return this._sendRequest(config, tokenAsParam, false);
            };
            const hasAccessToken = !!((_a = this.accessTokenStore) === null || _a === void 0 ? void 0 : _a.accessToken);
            if (HttpClient.isAxiosError(error) && ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === http_1.StatusCode.UNAUTHORIZED) {
                return retryWithTokenRefresh();
            }
            if (HttpClient.isBackendError(error)) {
                const mappedError = http_1.BackendErrorMapper.map(new http_1.BackendError(error.response.data.message, error.response.data.label, error.response.data.code));
                const isUnauthorized = mappedError.code === http_1.StatusCode.UNAUTHORIZED;
                const isExpiredTokenError = mappedError instanceof auth_1.TokenExpiredError;
                if ((isExpiredTokenError || isUnauthorized) && hasAccessToken && isFirstTry) {
                    return retryWithTokenRefresh();
                }
                if (mappedError instanceof auth_1.InvalidTokenError || mappedError instanceof auth_1.MissingCookieError) {
                    // On invalid cookie the application is supposed to logout.
                    this.logger.warn(`Cannot renew access token for "${config.method}" request to "${config.url}" because cookie/token is invalid: ${mappedError.message}`, mappedError);
                    this.emit(HttpClient.TOPIC.ON_INVALID_TOKEN, mappedError);
                }
                throw mappedError;
            }
            throw error;
        }
    }
    static isAxiosError(errorCandidate) {
        return errorCandidate.isAxiosError === true;
    }
    static isBackendError(errorCandidate) {
        if (errorCandidate.response) {
            const { data } = errorCandidate.response;
            return !!(data === null || data === void 0 ? void 0 : data.code) && !!(data === null || data === void 0 ? void 0 : data.label) && !!(data === null || data === void 0 ? void 0 : data.message);
        }
        return false;
    }
    async refreshAccessToken() {
        var _a;
        let expiredAccessToken;
        if ((_a = this.accessTokenStore.accessToken) === null || _a === void 0 ? void 0 : _a.access_token) {
            expiredAccessToken = this.accessTokenStore.accessToken;
        }
        const accessToken = await this.postAccess(expiredAccessToken);
        this.logger.info(`Received updated access token. It will expire in "${accessToken.expires_in}" seconds.`, obfuscation_1.ObfuscationUtil.obfuscateAccessToken(accessToken));
        return this.accessTokenStore.updateToken(accessToken);
    }
    async postAccess(expiredAccessToken) {
        const config = {
            headers: {},
            method: 'post',
            url: `${auth_1.AuthAPI.URL.ACCESS}`,
            withCredentials: true,
        };
        if (expiredAccessToken === null || expiredAccessToken === void 0 ? void 0 : expiredAccessToken.access_token) {
            config.headers.Authorization = `${expiredAccessToken.token_type} ${decodeURIComponent(expiredAccessToken.access_token)}`;
        }
        const response = await (0, cookie_1.sendRequestWithCookie)(this, config);
        return response.data;
    }
    async sendRequest(config, tokenAsParam = false, isSynchronousRequest = false) {
        return isSynchronousRequest
            ? this.requestQueue.add(() => this._sendRequest(config, tokenAsParam))
            : this._sendRequest(config, tokenAsParam);
    }
    sendJSON(config, isSynchronousRequest = false) {
        config.headers = Object.assign(Object.assign({}, config.headers), { 'Content-Type': http_1.ContentType.APPLICATION_JSON });
        return this.sendRequest(config, false, isSynchronousRequest);
    }
    sendXML(config) {
        config.headers = Object.assign(Object.assign({}, config.headers), { 'Content-Type': http_1.ContentType.APPLICATION_XML });
        return this.sendRequest(config, false, false);
    }
    sendProtocolBuffer(config, isSynchronousRequest = false) {
        config.headers = Object.assign(Object.assign({}, config.headers), { 'Content-Type': http_1.ContentType.APPLICATION_PROTOBUF });
        return this.sendRequest(config, false, isSynchronousRequest);
    }
}
exports.HttpClient = HttpClient;
HttpClient.TOPIC = TOPIC;
//# sourceMappingURL=HttpClient.js.map