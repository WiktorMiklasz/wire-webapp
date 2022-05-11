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
exports.ConnectionAPI = void 0;
const http_1 = require("../http/");
const ConnectionError_1 = require("./ConnectionError");
class ConnectionAPI {
    constructor(client, backendFeatures) {
        this.client = client;
        this.backendFeatures = backendFeatures;
    }
    /**
     * Get an existing connection to another user.
     * @param userId The ID of the other user
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/connection
     */
    async getConnection(userId) {
        const strUserId = typeof userId === 'string' ? userId : userId.id;
        const url = typeof userId !== 'string' && this.backendFeatures.federationEndpoints
            ? `${ConnectionAPI.URL.CONNECTIONS}/${userId.domain}/${userId}`
            : `${ConnectionAPI.URL.CONNECTIONS}/${strUserId}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * List the connections to other users.
     * @param limit Number of results to return (default 100, max 500)
     * @param connectionId The connection ID to start from
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/connections
     */
    async getConnections(connectionId, limit = 100) {
        const config = {
            method: 'get',
            params: {
                size: limit,
                start: connectionId,
            },
            url: ConnectionAPI.URL.CONNECTIONS,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get the list of all the connections to other users (including users that are on federated servers)
     *
     * @see https://nginz-https.anta.wire.link/api/swagger-ui/#/default/post_list_connections
     */
    getConnectionList() {
        if (!this.backendFeatures.federationEndpoints) {
            return this.getAllConnections();
        }
        let allConnections = [];
        const getConnectionChunks = async (pagingState) => {
            const connectionsPerRequest = 500;
            const config = {
                method: 'POST',
                data: {
                    size: connectionsPerRequest,
                    paging_state: pagingState,
                },
                url: '/list-connections',
            };
            const { data } = await this.client.sendJSON(config);
            const { connections, has_more, paging_state } = data;
            if (connections.length) {
                allConnections = allConnections.concat(connections);
            }
            if (has_more) {
                return getConnectionChunks(paging_state);
            }
            return allConnections;
        };
        return getConnectionChunks();
    }
    /**
     * Get all connections to other users.
     * @deprecated use `getConnectionList` instead
     */
    getAllConnections() {
        let allConnections = [];
        const getConnectionChunks = async (connectionId) => {
            const connectionsPerRequest = 500;
            const { connections, has_more } = await this.getConnections(connectionId, connectionsPerRequest);
            if (connections.length) {
                allConnections = allConnections.concat(connections);
            }
            if (has_more) {
                const lastConnection = connections.pop();
                if (lastConnection) {
                    return getConnectionChunks(lastConnection.to);
                }
            }
            return allConnections;
        };
        return getConnectionChunks();
    }
    async postConnection(userId, name) {
        if (this.backendFeatures.federationEndpoints) {
            return this.postConnection_v2(userId);
        }
        return this.postConnection_v1({ user: userId.id, name });
    }
    /**
     * Create a connection to another user.
     * Note: You can have no more than 1000 connections in accepted or sent state.
     * @deprecated use createConnection instead
     * @param connectionRequestData: The connection request
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/createConnection
     */
    async postConnection_v1(connectionRequestData) {
        const config = {
            data: connectionRequestData,
            method: 'post',
            url: ConnectionAPI.URL.CONNECTIONS,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            switch (error.label) {
                case http_1.BackendErrorLabel.LEGAL_HOLD_MISSING_CONSENT: {
                    throw new ConnectionError_1.ConnectionLegalholdMissingConsentError(error.message);
                }
            }
            throw error;
        }
    }
    /**
     * Create a connection to another user.
     * Note: You can have no more than 1000 connections in accepted or sent state.
     * @param qualifiedUserId: The qualified id of the user we want to connect to
     * @see https://nginz-https.anta.wire.link/api/swagger-ui/#/default/post_connections__uid_domain___uid
     */
    async postConnection_v2({ id, domain }) {
        const config = {
            method: 'post',
            url: `${ConnectionAPI.URL.CONNECTIONS}/${domain}/${id}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            switch (error.label) {
                case http_1.BackendErrorLabel.LEGAL_HOLD_MISSING_CONSENT: {
                    throw new ConnectionError_1.ConnectionLegalholdMissingConsentError(error.message);
                }
            }
            throw error;
        }
    }
    /**
     * Update a connection.
     * Note: You can have no more than 1000 connections in accepted or sent state.
     * @param userId The ID of the other user (qualified or not)
     * @param updatedConnection: The updated connection
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/updateConnection
     */
    async putConnection(userId, updatedConnection) {
        const strUserId = typeof userId === 'string' ? userId : userId.id;
        const url = this.backendFeatures.federationEndpoints && typeof userId !== 'string'
            ? `${ConnectionAPI.URL.CONNECTIONS}/${userId.domain}/${userId.id}`
            : `${ConnectionAPI.URL.CONNECTIONS}/${strUserId}`;
        const config = {
            data: updatedConnection,
            method: 'put',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
}
exports.ConnectionAPI = ConnectionAPI;
ConnectionAPI.URL = {
    CONNECTIONS: '/connections',
};
//# sourceMappingURL=ConnectionAPI.js.map