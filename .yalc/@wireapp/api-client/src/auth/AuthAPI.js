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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthAPI = void 0;
const http_1 = require("../http/");
const client_1 = require("../client/");
const AuthenticationError_1 = require("./AuthenticationError");
const cookie_1 = require("../shims/node/cookie");
class AuthAPI {
    constructor(client) {
        this.client = client;
    }
    getCookies(labels) {
        const config = {
            method: 'get',
            params: {},
            url: AuthAPI.URL.COOKIES,
        };
        if (labels) {
            config.params.labels = labels.join(',');
        }
        return this.client.sendRequest(config);
    }
    async postCookiesRemove(password, labels, ids) {
        const config = {
            data: {
                ids,
                labels,
                password,
            },
            method: 'post',
            url: `${AuthAPI.URL.COOKIES}/${AuthAPI.URL.REMOVE}`,
            withCredentials: true,
        };
        await this.client.sendJSON(config);
    }
    async postLogin(loginData) {
        const { verificationCode } = loginData, rest = __rest(loginData, ["verificationCode"]);
        const login = Object.assign(Object.assign(Object.assign({}, rest), (verificationCode && { verification_code: verificationCode })), { clientType: undefined, password: loginData.password ? String(loginData.password) : undefined });
        const config = {
            data: login,
            method: 'post',
            params: {
                persist: loginData.clientType === client_1.ClientType.PERMANENT,
            },
            url: AuthAPI.URL.LOGIN,
            withCredentials: true,
        };
        const response = await this.client.sendJSON(config);
        return (0, cookie_1.retrieveCookie)(response);
    }
    /**
     * This operation generates and sends a login code. A login code can be used only once and times out after 10
     * minutes. Only one login code may be pending at a time.
     * @param loginRequest Phone number to use for login SMS or voice call.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/tab.html#!/sendLoginCode
     */
    async postLoginSend(loginRequest) {
        // https://github.com/zinfra/backend-issues/issues/974
        const defaultLoginRequest = { force: false };
        const config = {
            data: Object.assign(Object.assign({}, defaultLoginRequest), loginRequest),
            method: 'post',
            url: `${AuthAPI.URL.LOGIN}/${AuthAPI.URL.SEND}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.BAD_REQUEST: {
                    throw new AuthenticationError_1.InvalidPhoneNumberError(backendError.message);
                }
                case http_1.BackendErrorLabel.INVALID_PHONE:
                case http_1.BackendErrorLabel.UNAUTHORIZED: {
                    throw new AuthenticationError_1.ForbiddenPhoneNumberError(backendError.message);
                }
                case http_1.BackendErrorLabel.PASSWORD_EXISTS: {
                    throw new AuthenticationError_1.PasswordExistsError(backendError.message);
                }
            }
            throw error;
        }
    }
    async postLogout() {
        const config = {
            method: 'post',
            url: `${AuthAPI.URL.ACCESS}/${AuthAPI.URL.LOGOUT}`,
            withCredentials: true,
        };
        await (0, cookie_1.sendRequestWithCookie)(this.client, config);
    }
    async postRegister(userAccount) {
        const config = {
            data: userAccount,
            method: 'post',
            url: AuthAPI.URL.REGISTER,
            withCredentials: true,
        };
        const response = await this.client.sendJSON(config);
        return (0, cookie_1.retrieveCookie)(response);
    }
    async putEmail(emailData) {
        const config = {
            data: emailData,
            method: 'put',
            url: `${AuthAPI.URL.ACCESS}/${AuthAPI.URL.SELF}/${AuthAPI.URL.EMAIL}`,
            withCredentials: true,
        };
        await this.client.sendJSON(config);
    }
    async headInitiateLogin(ssoCode) {
        const config = {
            method: 'head',
            url: `${AuthAPI.URL.SSO}/${AuthAPI.URL.INITIATE_LOGIN}/${ssoCode}`,
        };
        await this.client.sendJSON(config);
    }
    async headInitiateBind(ssoCode) {
        const config = {
            method: 'head',
            url: `${AuthAPI.URL.INITIATE_BIND}/${ssoCode}`,
        };
        await this.client.sendJSON(config);
    }
}
exports.AuthAPI = AuthAPI;
AuthAPI.URL = {
    ACCESS: '/access',
    COOKIES: '/cookies',
    EMAIL: 'email',
    INITIATE_BIND: '/sso-initiate-bind',
    INITIATE_LOGIN: 'initiate-login',
    LOGIN: '/login',
    LOGOUT: 'logout',
    REGISTER: '/register',
    REMOVE: 'remove',
    SELF: 'self',
    SEND: 'send',
    SSO: '/sso',
};
//# sourceMappingURL=AuthAPI.js.map