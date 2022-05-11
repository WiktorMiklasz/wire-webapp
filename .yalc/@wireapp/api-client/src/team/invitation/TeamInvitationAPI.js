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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamInvitationAPI = void 0;
const team_1 = require("../team/");
const http_1 = require("../../http/");
const http_status_codes_1 = require("http-status-codes");
const InvitationError_1 = require("./InvitationError");
class TeamInvitationAPI {
    constructor(client) {
        this.client = client;
    }
    async getInvitation(teamId, invitationId) {
        const config = {
            method: 'get',
            url: `${team_1.TeamAPI.URL.TEAMS}/${teamId}/${TeamInvitationAPI.URL.INVITATIONS}/${invitationId}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getAllInvitations(teamId) {
        let allInvitations = [];
        let invitationChunk = await this.getInvitations(teamId, undefined);
        allInvitations = allInvitations.concat(invitationChunk.invitations);
        while (invitationChunk.has_more) {
            const invitations = invitationChunk.invitations;
            const lastInvitation = invitations[invitations.length - 1] || {};
            const lastChunkId = lastInvitation.id;
            invitationChunk = await this.getInvitations(teamId, lastChunkId);
            allInvitations = allInvitations.concat(invitationChunk.invitations);
        }
        return allInvitations;
    }
    async getInvitations(teamId, startId, limit = TeamInvitationAPI.MAX_CHUNK_SIZE) {
        const config = {
            method: 'get',
            params: {
                size: limit,
                start: startId,
            },
            url: `${team_1.TeamAPI.URL.TEAMS}/${teamId}/${TeamInvitationAPI.URL.INVITATIONS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async deleteInvitation(teamId, invitationId) {
        const config = {
            method: 'delete',
            url: `${team_1.TeamAPI.URL.TEAMS}/${teamId}/${TeamInvitationAPI.URL.INVITATIONS}/${invitationId}`,
        };
        await this.client.sendJSON(config);
    }
    async headInvitation(email) {
        var _a;
        const config = {
            method: 'head',
            params: {
                email,
            },
            url: `${team_1.TeamAPI.URL.TEAMS}/${TeamInvitationAPI.URL.INVITATIONS}/${TeamInvitationAPI.URL.EMAIL}`,
        };
        try {
            await this.client.sendJSON(config);
        }
        catch (error) {
            const status = (_a = error.response) === null || _a === void 0 ? void 0 : _a.status;
            switch (status) {
                case http_status_codes_1.StatusCodes.NOT_FOUND: {
                    throw new InvitationError_1.InvitationNotFoundError('Invitation not found');
                }
                case http_status_codes_1.StatusCodes.CONFLICT: {
                    throw new InvitationError_1.InvitationMultipleError('Multiple invitations found');
                }
            }
            throw error;
        }
    }
    async postInvitation(teamId, invitation) {
        const config = {
            data: invitation,
            method: 'post',
            url: `${team_1.TeamAPI.URL.TEAMS}/${teamId}/${TeamInvitationAPI.URL.INVITATIONS}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.INVITE_EMAIL_EXISTS: {
                    throw new InvitationError_1.InvitationEmailExistsError(backendError.message);
                }
                case http_1.BackendErrorLabel.BAD_REQUEST: {
                    throw new InvitationError_1.InvitationInvalidPhoneError(backendError.message);
                }
                case http_1.BackendErrorLabel.INVALID_EMAIL: {
                    throw new InvitationError_1.InvitationInvalidEmailError(backendError.message);
                }
                case http_1.BackendErrorLabel.PHONE_EXISTS: {
                    throw new InvitationError_1.InvitationPhoneExistsError(backendError.message);
                }
            }
            throw error;
        }
    }
    async getInvitationFromCode(invitationCode) {
        const config = {
            method: 'get',
            params: {
                code: invitationCode,
            },
            url: `${team_1.TeamAPI.URL.TEAMS}/${TeamInvitationAPI.URL.INVITATIONS}/${TeamInvitationAPI.URL.INFO}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
}
exports.TeamInvitationAPI = TeamInvitationAPI;
TeamInvitationAPI.MAX_CHUNK_SIZE = 100;
TeamInvitationAPI.URL = {
    INFO: 'info',
    INVITATIONS: 'invitations',
    EMAIL: 'by-email',
};
//# sourceMappingURL=TeamInvitationAPI.js.map