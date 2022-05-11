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
exports.TeamAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const http_1 = require("../../http/");
const user_1 = require("../../user");
class TeamAPI {
    constructor(client) {
        this.client = client;
    }
    async postTeam(team) {
        const config = {
            data: team,
            method: 'post',
            url: `${TeamAPI.URL.TEAMS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.headers.location;
    }
    async putTeam(teamId, teamData) {
        const config = {
            data: teamData,
            method: 'put',
            url: `${TeamAPI.URL.TEAMS}/${teamId}`,
        };
        await this.client.sendJSON(config);
    }
    async getTeams() {
        const config = {
            method: 'get',
            url: `${TeamAPI.URL.TEAMS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getTeam(teamId) {
        const config = {
            method: 'get',
            url: `${TeamAPI.URL.TEAMS}/${teamId}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async deleteTeam(teamId, password, verificationCode) {
        const config = {
            data: Object.assign({ password }, (verificationCode && { verification_code: verificationCode })),
            method: 'delete',
            url: `${TeamAPI.URL.TEAMS}/${teamId}`,
        };
        await this.client.sendJSON(config);
    }
    async getTeamSize(teamId) {
        const cancelSource = axios_1.default.CancelToken.source();
        const config = {
            cancelToken: cancelSource.token,
            method: 'get',
            url: `${TeamAPI.URL.TEAMS}/${teamId}/${TeamAPI.URL.SIZE}`,
        };
        const handleRequest = async () => {
            try {
                const response = await this.client.sendJSON(config);
                return response.data;
            }
            catch (error) {
                if (error.message === http_1.SyntheticErrorLabel.REQUEST_CANCELLED) {
                    throw new user_1.RequestCancellationError('Team size request got cancelled');
                }
                throw error;
            }
        };
        return {
            cancel: () => cancelSource.cancel(http_1.SyntheticErrorLabel.REQUEST_CANCELLED),
            response: handleRequest(),
        };
    }
    async postLead(data) {
        const config = {
            data,
            method: 'post',
            url: `${TeamAPI.URL.CONSENT}/${TeamAPI.URL.MARKETO}/${TeamAPI.URL.LEAD}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async putLead(data) {
        const config = {
            data,
            method: 'put',
            url: `${TeamAPI.URL.CONSENT}/${TeamAPI.URL.MARKETO}/${TeamAPI.URL.LEAD}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
}
exports.TeamAPI = TeamAPI;
TeamAPI.URL = {
    SIZE: 'size',
    TEAMS: '/teams',
    CONSENT: '/consent',
    MARKETO: 'marketo',
    LEAD: 'lead',
};
//# sourceMappingURL=TeamAPI.js.map