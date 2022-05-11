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
exports.BroadcastAPI = void 0;
const otr_1 = require("@wireapp/protocol-messaging/web/otr");
const validation_1 = require("../validation/");
class BroadcastAPI {
    constructor(client) {
        this.client = client;
    }
    /**
     * Broadcast an encrypted message to all team members and all contacts (accepts Protobuf).
     * @param sendingClientId The sender's client ID
     * @param messageData The message content
     * @param ignoreMissing Whether to report missing clients or not:
     * `false`: Report about all missing clients
     * `true`: Ignore all missing clients and force sending
     * Array: User IDs specifying which user IDs are allowed to have
     * missing clients
     * `undefined`: Default to setting of `report_missing` in `NewOTRMessage`
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/tab.html#!/postOtrBroadcast
     */
    async postBroadcastMessage(sendingClientId, messageData, ignoreMissing) {
        if (!sendingClientId) {
            throw new validation_1.ValidationError('Unable to send OTR message without client ID.');
        }
        const config = {
            data: messageData,
            method: 'post',
            url: BroadcastAPI.URL.BROADCAST,
        };
        if (typeof ignoreMissing !== 'undefined') {
            const ignore_missing = Array.isArray(ignoreMissing) ? ignoreMissing.join(',') : ignoreMissing;
            config.params = { ignore_missing };
            // `ignore_missing` takes precedence on the server so we can remove
            // `report_missing` to save some bandwidth.
            delete messageData.report_missing;
        }
        else if (typeof messageData.report_missing === 'undefined') {
            // both `ignore_missing` and `report_missing` are undefined
            config.params = { ignore_missing: !!messageData.data };
        }
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Broadcast an encrypted message to all team members and all contacts (accepts Protobuf).
     * @param sendingClientId The sender's client ID
     * @param messageData The message content
     * @param ignoreMissing Whether to report missing clients or not:
     * `false`: Report about all missing clients
     * `true`: Ignore all missing clients and force sending
     * Array: User IDs specifying which user IDs are allowed to have
     * missing clients
     * `undefined`: Default to setting of `report_missing` in `NewOTRMessage`
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/tab.html#!/postOtrBroadcast
     */
    async postBroadcastProtobufMessage(sendingClientId, messageData, ignoreMissing) {
        if (!sendingClientId) {
            throw new validation_1.ValidationError('Unable to send OTR message without client ID.');
        }
        const config = {
            data: otr_1.proteus.NewOtrMessage.encode(messageData).finish(),
            method: 'post',
            url: BroadcastAPI.URL.BROADCAST,
        };
        if (typeof ignoreMissing !== 'undefined') {
            const ignore_missing = Array.isArray(ignoreMissing) ? ignoreMissing.join(',') : ignoreMissing;
            config.params = { ignore_missing };
            // `ignore_missing` takes precedence on the server so we can remove
            // `report_missing` to save some bandwidth.
            messageData.reportMissing = [];
        }
        else if (typeof messageData.reportMissing === 'undefined' || !messageData.reportMissing.length) {
            // both `ignore_missing` and `report_missing` are undefined
            config.params = { ignore_missing: !!messageData.blob };
        }
        const response = await this.client.sendProtocolBuffer(config);
        return response.data;
    }
    /**
     * Broadcast an encrypted message to all team members and all contacts in federated environments
     * @param sendingClientId The sender's client ID
     * @param messageData The message content
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/tab.html#!/postOtrBroadcast
     */
    async postBroadcastFederatedMessage(sendingClientId, messageData) {
        if (!sendingClientId) {
            throw new validation_1.ValidationError('Unable to send OTR message without client ID.');
        }
        const config = {
            data: otr_1.proteus.QualifiedNewOtrMessage.encode(messageData).finish().slice(),
            method: 'post',
            url: BroadcastAPI.URL.BROADCAST_FEDERATED,
        };
        const response = await this.client.sendProtocolBuffer(config);
        return response.data;
    }
}
exports.BroadcastAPI = BroadcastAPI;
BroadcastAPI.URL = {
    BROADCAST: '/broadcast/otr/messages',
    BROADCAST_FEDERATED: '/broadcast/proteus/messages',
};
//# sourceMappingURL=BroadcastAPI.js.map