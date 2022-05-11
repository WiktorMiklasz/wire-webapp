"use strict";
/*
 * Wire
 * Copyright (C) 2021 Wire Swiss GmbH
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
exports.ScimAPI = void 0;
class ScimAPI {
    constructor(client) {
        this.client = client;
    }
    async getTokens() {
        const config = {
            method: 'get',
            url: `${ScimAPI.URL.SCIM}/${ScimAPI.URL.AUTH_TOKENS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async deleteToken(scimTokenId) {
        const config = {
            method: 'delete',
            params: { id: scimTokenId },
            url: `${ScimAPI.URL.SCIM}/${ScimAPI.URL.AUTH_TOKENS}`,
        };
        await this.client.sendJSON(config);
    }
    async postToken(description, password, verificationCode) {
        const config = {
            data: Object.assign({ description, password }, (verificationCode && { verification_code: verificationCode })),
            method: 'post',
            url: `${ScimAPI.URL.SCIM}/${ScimAPI.URL.AUTH_TOKENS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
}
exports.ScimAPI = ScimAPI;
ScimAPI.URL = {
    AUTH_TOKENS: 'auth-tokens',
    SCIM: '/scim',
};
//# sourceMappingURL=ScimAPI.js.map