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
exports.UserService = void 0;
const protocol_messaging_1 = require("@wireapp/protocol-messaging");
const uuidjs_1 = __importDefault(require("uuidjs"));
const TypePredicateUtil_1 = require("../util/TypePredicateUtil");
const connection_1 = require("@wireapp/api-client/src/connection");
class UserService {
    constructor(apiClient, broadcastService, conversationService, connectionService) {
        this.apiClient = apiClient;
        this.broadcastService = broadcastService;
        this.connectionService = connectionService;
        this.conversationService = conversationService;
    }
    getUser(userId) {
        return this.apiClient.api.user.getUser(userId);
    }
    async getUsers(userIds) {
        if (!userIds.length) {
            return [];
        }
        return (0, TypePredicateUtil_1.isQualifiedIdArray)(userIds)
            ? this.apiClient.api.user.postListUsers({ qualified_ids: userIds })
            : this.apiClient.api.user.getUsers({ ids: userIds });
    }
    /**
     * Sends a availability update to members of the same team
     * @param teamId
     * @param type
     * @param options.sendAll=false will broadcast the message to all the members of the team (instead of just direct connections). Should be avoided in a big team
     * @param options.sendAsProtobuf=false
     */
    async setAvailability(teamId, type, { sendAll = false, sendAsProtobuf = false } = {}) {
        // Get pre-key bundles for members of your own team
        const preKeyBundlesFromTeam = await this.broadcastService.getPreKeyBundlesFromTeam(teamId, false, !sendAll);
        // Get pre-key bundles for all of your other 1:1 connections
        const connections = await this.connectionService.getConnections();
        const acceptedConnections = connections.filter(connection => connection.status === connection_1.ConnectionStatus.ACCEPTED);
        const preKeyBundlePromises = acceptedConnections.map(connection => {
            const mappedConnection = {
                userId: connection.to,
                conversationId: connection.conversation,
            };
            return this.conversationService.getPreKeyBundleMap(mappedConnection.conversationId, [mappedConnection.userId]);
        });
        const preKeyBundlesFromConnections = await Promise.all(preKeyBundlePromises);
        // Merge pre-key bundles
        const allPreKeyBundles = preKeyBundlesFromConnections.reduce((accumulator, preKeyBundleMap) => {
            return Object.assign(Object.assign({}, accumulator), preKeyBundleMap);
        }, preKeyBundlesFromTeam);
        const genericMessage = protocol_messaging_1.GenericMessage.create({
            availability: new protocol_messaging_1.Availability({ type }),
            messageId: uuidjs_1.default.genV4().toString(),
        });
        // Broadcast availability status to your team members & external 1:1 connections
        await this.broadcastService.broadcastGenericMessage(genericMessage, allPreKeyBundles, sendAsProtobuf);
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map