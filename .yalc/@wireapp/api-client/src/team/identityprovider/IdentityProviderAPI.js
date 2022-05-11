"use strict";
/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityProviderAPI = void 0;
class IdentityProviderAPI {
    constructor(client) {
        this.client = client;
    }
    async getIdentityProvider(identityProviderId) {
        const config = {
            method: 'get',
            url: `${IdentityProviderAPI.URL.PROVIDER}/${identityProviderId}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getIdentityProviders() {
        const config = {
            method: 'get',
            url: `${IdentityProviderAPI.URL.PROVIDER}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async deleteIdentityProvider(identityProviderId, force) {
        const config = {
            method: 'delete',
            url: `${IdentityProviderAPI.URL.PROVIDER}/${identityProviderId}`,
        };
        if (force) {
            config.params = { force };
        }
        await this.client.sendJSON(config);
    }
    async postIdentityProvider(identityData, replaceProviderId) {
        const config = {
            data: identityData,
            method: 'post',
            url: `${IdentityProviderAPI.URL.PROVIDER}`,
        };
        if (replaceProviderId) {
            config.params = { replaces: replaceProviderId };
        }
        const response = await this.client.sendXML(config);
        return response.data;
    }
    async putIdentityProvider(identityProviderId, identityData) {
        const config = {
            data: identityData,
            method: 'put',
            url: `${IdentityProviderAPI.URL.PROVIDER}/${identityProviderId}`,
        };
        const response = await this.client.sendXML(config);
        return response.data;
    }
    async getMetadata() {
        const config = {
            method: 'get',
            url: `${IdentityProviderAPI.URL.SSO}/${IdentityProviderAPI.URL.METADATA}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
}
exports.IdentityProviderAPI = IdentityProviderAPI;
IdentityProviderAPI.URL = {
    METADATA: 'metadata',
    PROVIDER: '/identity-providers',
    SSO: '/sso',
};
//# sourceMappingURL=IdentityProviderAPI.js.map