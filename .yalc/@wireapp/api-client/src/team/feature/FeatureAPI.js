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
exports.FeatureAPI = void 0;
const http_1 = require("../../http");
const FeatureError_1 = require("./FeatureError");
const _1 = require(".");
class FeatureAPI {
    constructor(client) {
        this.client = client;
    }
    async getAllFeatures() {
        const config = {
            method: 'get',
            url: FeatureAPI.URL.FEATURE_CONFIGS,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * @deprecated Use `getAllFeatures()` instead.
     */
    async getAllTeamFeatures(teamId) {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.TEAMS}/${teamId}/${FeatureAPI.URL.FEATURES}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getLegalholdFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.LEGAL_HOLD}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getConversationGuestLinkFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.CONVERSATION_GUEST_LINKS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async putConversationGuestLinkFeature(teamId, conversationGuestLinkFeature) {
        const config = {
            data: conversationGuestLinkFeature,
            method: 'put',
            url: `${FeatureAPI.URL.TEAMS}/${teamId}/${FeatureAPI.URL.FEATURES}/${FeatureAPI.URL.CONVERSATION_GUEST_LINKS}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            switch (error.label) {
                case http_1.BackendErrorLabel.FEATURE_LOCKED: {
                    throw new _1.FeatureLockedError(error.message);
                }
            }
            throw error;
        }
    }
    async getConferenceCallingFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.CALLING_CONFERENCE}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async putConferenceCallingFeature(teamId, conferenceCallingFeature) {
        const config = {
            data: conferenceCallingFeature,
            method: 'put',
            url: `${FeatureAPI.URL.TEAMS}/${teamId}/${FeatureAPI.URL.FEATURES}/${FeatureAPI.URL.CALLING_CONFERENCE}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            switch (error.label) {
                case http_1.BackendErrorLabel.FEATURE_LOCKED: {
                    throw new _1.FeatureLockedError(error.message);
                }
            }
            throw error;
        }
    }
    async getVideoCallingFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.CALLING_VIDEO}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async putVideoCallingFeature(teamId, videoCallingFeature) {
        const config = {
            data: videoCallingFeature,
            method: 'put',
            url: `${FeatureAPI.URL.TEAMS}/${teamId}/${FeatureAPI.URL.FEATURES}/${FeatureAPI.URL.CALLING_VIDEO}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            switch (error.label) {
                case http_1.BackendErrorLabel.FEATURE_LOCKED: {
                    throw new _1.FeatureLockedError(error.message);
                }
            }
            throw error;
        }
    }
    async getSelfDeletingMessagesFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.SELF_DELETING_MESSAGES}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async putSelfDeletingMessagesFeature(teamId, selfDeleteingMessagesFeature) {
        const config = {
            data: selfDeleteingMessagesFeature,
            method: 'put',
            url: `${FeatureAPI.URL.TEAMS}/${teamId}/${FeatureAPI.URL.FEATURES}/${FeatureAPI.URL.SELF_DELETING_MESSAGES}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            switch (error.label) {
                case http_1.BackendErrorLabel.FEATURE_LOCKED: {
                    throw new _1.FeatureLockedError(error.message);
                }
            }
            throw error;
        }
    }
    async getFileSharingFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.FILE_SHARING}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async putFileSharingFeature(teamId, fileSharingFeature) {
        const config = {
            data: fileSharingFeature,
            method: 'put',
            url: `${FeatureAPI.URL.TEAMS}/${teamId}/${FeatureAPI.URL.FEATURES}/${FeatureAPI.URL.FILE_SHARING}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            switch (error.label) {
                case http_1.BackendErrorLabel.FEATURE_LOCKED: {
                    throw new _1.FeatureLockedError(error.message);
                }
            }
            throw error;
        }
    }
    async getSndFactorPasswordFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.SND_FACTOR_PASSWORD}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getSSOFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.SSO}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getDigitalSignatureFeature(teamId) {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.TEAMS}/${teamId}/${FeatureAPI.URL.FEATURES}/${FeatureAPI.URL.DIGITAL_SIGNATURES}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getAppLockFeature() {
        const config = {
            method: 'get',
            url: `${FeatureAPI.URL.FEATURE_CONFIGS}/${FeatureAPI.URL.APPLOCK}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async putAppLockFeature(teamId, appLockFeature) {
        const config = {
            data: appLockFeature,
            method: 'put',
            url: `${FeatureAPI.URL.TEAMS}/${teamId}/${FeatureAPI.URL.FEATURES}/${FeatureAPI.URL.APPLOCK}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            switch (error.label) {
                case http_1.BackendErrorLabel.APP_LOCK_INVALID_TIMEOUT: {
                    throw new FeatureError_1.InvalidAppLockTimeoutError(error.message);
                }
                case http_1.BackendErrorLabel.FEATURE_LOCKED: {
                    throw new _1.FeatureLockedError(error.message);
                }
            }
            throw error;
        }
    }
}
exports.FeatureAPI = FeatureAPI;
FeatureAPI.URL = {
    APPLOCK: 'appLock',
    CALLING_CONFERENCE: 'conferenceCalling',
    CALLING_VIDEO: 'videoCalling',
    SELF_DELETING_MESSAGES: 'selfDeletingMessages',
    DIGITAL_SIGNATURES: 'digitalSignatures',
    CONVERSATION_GUEST_LINKS: 'conversationGuestLinks',
    FEATURE_CONFIGS: '/feature-configs',
    FEATURES: 'features',
    FILE_SHARING: 'fileSharing',
    LEGAL_HOLD: 'legalhold',
    SND_FACTOR_PASSWORD: 'sndFactorPasswordChallenge',
    SSO: 'sso',
    TEAMS: '/teams',
};
//# sourceMappingURL=FeatureAPI.js.map