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
exports.ConversationAPI = void 0;
const otr_1 = require("@wireapp/protocol-messaging/web/otr");
const validation_1 = require("../validation/");
const ConversationRole_1 = require("./ConversationRole");
const http_1 = require("../http/");
const ConversationError_1 = require("./ConversationError");
const ArrayUtil_1 = require("@wireapp/commons/src/main/util/ArrayUtil");
class ConversationAPI {
    constructor(client, backendFeatures) {
        this.client = client;
        this.backendFeatures = backendFeatures;
    }
    /**
     * Delete a conversation code.
     * @param conversationId ID of conversation to delete the code for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/deleteConversationCode
     */
    async deleteConversationCode(conversationId) {
        const config = {
            method: 'delete',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.CODE}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * @deprecated Use `deleteService()` instead.
     */
    deleteBot(conversationId, serviceId) {
        return this.deleteService(conversationId, serviceId);
    }
    /**
     * Remove service from conversation.
     * @param conversationId The conversation ID to remove the service from
     * @param serviceId The ID of the service to be removed from the conversation
     */
    async deleteService(conversationId, serviceId) {
        const config = {
            method: 'delete',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.BOTS}/${serviceId}`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Remove member from conversation.
     * @param conversationId The conversation ID to remove the user from
     * @param userId The user to remove
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/removeMember
     */
    async deleteMember(conversationId, userId) {
        const convId = typeof conversationId === 'string' ? { id: conversationId, domain: '' } : conversationId;
        const uId = typeof userId === 'string' ? { id: userId, domain: '' } : userId;
        const isFederated = this.backendFeatures.federationEndpoints && convId.domain && uId.domain;
        const url = isFederated
            ? `${ConversationAPI.URL.CONVERSATIONS}/${convId.id}/${ConversationAPI.URL.MEMBERS}/${uId.id}`
            : `${ConversationAPI.URL.CONVERSATIONS}/${convId.domain}/${convId.id}/${ConversationAPI.URL.MEMBERS}/${uId.domain}/${uId.id}`;
        const response = await this.client.sendJSON({
            method: 'delete',
            url,
        });
        return response.data;
    }
    /**
     * Get all conversations.
     * @deprecated - use getConversationList instead
     */
    getAllConversations() {
        let allConversations = [];
        const getConversationChunks = async (conversationId) => {
            const { conversations, has_more } = await this.getConversations(conversationId, ConversationAPI.MAX_CHUNK_SIZE);
            if (conversations.length) {
                allConversations = allConversations.concat(conversations);
            }
            if (has_more) {
                const lastConversation = conversations.pop();
                if (lastConversation) {
                    return getConversationChunks(lastConversation.id);
                }
            }
            return allConversations;
        };
        return getConversationChunks();
    }
    /**
     * Get a conversation code.
     * @param conversationId ID of conversation to get the code for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/getConversationCode
     */
    async getConversationCode(conversationId) {
        const config = {
            method: 'GET',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.CODE}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getConversationGuestLinkFeature(conversationId) {
        const config = {
            method: 'get',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/features/conversationGuestLinks`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getConversation(conversationId) {
        return this.backendFeatures.federationEndpoints && typeof conversationId !== 'string'
            ? this.getConversation_v2(conversationId)
            : this.getConversation_v1(typeof conversationId === 'string' ? conversationId : conversationId.id);
    }
    /**
     * Get a conversation by ID.
     * @param conversationId The conversation ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversation
     */
    async getConversation_v1(conversationId) {
        const url = `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getConversation_v2(conversationId) {
        const { id, domain } = conversationId;
        const url = `${ConversationAPI.URL.CONVERSATIONS}/${domain}/${id}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get all qualified conversation IDs.
     * @param limit Max. number of qualified IDs to return
     */
    async getQualifiedConversationIds(limit = 0) {
        const config = {
            data: {},
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${ConversationAPI.URL.LIST_IDS}`,
        };
        if (limit > 0) {
            config.data.size = limit;
        }
        const allConversations = [];
        const getConversationChunks = async (pagingState) => {
            if (pagingState) {
                config.data.paging_state = pagingState;
            }
            const { data } = await this.client.sendJSON(config);
            const { qualified_conversations, has_more, paging_state } = data;
            allConversations.push(...qualified_conversations);
            if (has_more) {
                return getConversationChunks(paging_state);
            }
            return allConversations;
        };
        return getConversationChunks();
    }
    /**
     * Get all conversation IDs.
     * @param limit Max. number of IDs to return
     * @param conversationId Conversation ID to start from (exclusive)
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversationIds
     * @deprecated Use `getListConversations()` instead.
     */
    async getConversationIds(limit, conversationId) {
        const config = {
            method: 'get',
            params: {
                size: limit,
                start: conversationId,
            },
            url: `${ConversationAPI.URL.CONVERSATIONS}/${ConversationAPI.URL.IDS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get conversations as chunks.
     * Note: At most 500 conversations are returned per request.
     * @param startConversationId Conversation ID to start from (exclusive). Mutually exclusive with `conversationIds`.
     * @param limit Max. number of conversations to return
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversations
     */
    getConversations(startConversationId, limit = ConversationAPI.MAX_CHUNK_SIZE) {
        return this._getConversations(startConversationId, undefined, limit);
    }
    /**
     * Get conversation metadata for a list of conversation qualified ids
     * @see https://staging-nginz-https.zinfra.io/api/swagger-ui/#/default/post_conversations_list_v2
     */
    async getConversationsByQualifiedIds(conversations) {
        var _a, _b, _c, _d, _e, _f;
        const chunks = (0, ArrayUtil_1.chunk)(conversations, ConversationAPI.MAX_CHUNK_SIZE);
        let results = { found: [], failed: [], not_found: [] };
        for (const chunk of chunks) {
            const config = {
                data: { qualified_ids: chunk },
                method: 'post',
                url: `${ConversationAPI.URL.CONVERSATIONS}/${ConversationAPI.URL.LIST}/${ConversationAPI.URL.V2}`,
            };
            const { data } = await this.client.sendJSON(config);
            results = {
                found: (_a = results.found) === null || _a === void 0 ? void 0 : _a.concat((_b = data.found) !== null && _b !== void 0 ? _b : []),
                not_found: (_c = results.not_found) === null || _c === void 0 ? void 0 : _c.concat((_d = data.not_found) !== null && _d !== void 0 ? _d : []),
                failed: (_e = results.failed) === null || _e === void 0 ? void 0 : _e.concat((_f = data.failed) !== null && _f !== void 0 ? _f : []),
            };
        }
        return results;
    }
    /**
     * Get all local & remote conversations from a federated backend.
     */
    async getConversationList() {
        if (!this.backendFeatures.federationEndpoints) {
            return this.getAllConversations();
        }
        const allConversationIds = await this.getQualifiedConversationIds();
        const conversations = await this.getConversationsByQualifiedIds(allConversationIds);
        return conversations.found || [];
    }
    /**
     * Get conversations.
     * Note: At most 500 conversations are returned per request.
     * @param conversationId Conversation ID to start from (exclusive). Mutually exclusive with `conversationIds`.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversations
     */
    async getConversationsByIds(filteredConversationIds) {
        let allConversations = [];
        const getConversationChunk = async (chunkedConversationIds) => {
            const { conversations } = await this._getConversations(undefined, chunkedConversationIds, ConversationAPI.MAX_CHUNK_SIZE);
            return conversations;
        };
        for (let index = 0; index < filteredConversationIds.length; index += ConversationAPI.MAX_CHUNK_SIZE) {
            const requestChunk = filteredConversationIds.slice(index, index + ConversationAPI.MAX_CHUNK_SIZE);
            if (requestChunk.length) {
                const conversationChunk = await getConversationChunk(requestChunk);
                if (conversationChunk.length) {
                    allConversations = allConversations.concat(conversationChunk);
                }
            }
        }
        return allConversations;
    }
    /**
     * Get conversations.
     * Note: At most 500 conversations are returned per request.
     * @param startConversationId Conversation ID to start from (exclusive). Mutually exclusive with `conversationIds`.
     * @param filteredConversationIds Mutually exclusive with `startConversationId`. At most 32 IDs per request.
     * @param limit Max. number of conversations to return
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversations
     */
    async _getConversations(startConversationId, filteredConversationIds, limit = ConversationAPI.MAX_CHUNK_SIZE) {
        const config = {
            method: 'get',
            params: {
                size: limit,
                start: startConversationId,
            },
            url: ConversationAPI.URL.CONVERSATIONS,
        };
        if (filteredConversationIds) {
            config.params.ids = filteredConversationIds.join(',');
        }
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get existing roles available for the given conversation.
     * @param conversationId The Conversation ID to get roles for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/getConversationsRoles
     */
    async getRoles(conversationId) {
        const config = {
            method: 'get',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.ROLES}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get self membership properties.
     * @param conversationId The Conversation ID to get properties for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/getSelf
     */
    async getMembershipProperties(conversationId) {
        const config = {
            method: 'get',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/self`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Create a 1:1-conversation.
     * @param conversationData The new conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/createOne2OneConversation
     */
    async post1to1(conversationData) {
        const config = {
            data: conversationData,
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/one2one`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Add users to an existing conversation.
     * @param conversationId The conversation ID
     * @param invitationData The new conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/addMembers
     */
    async postAddMembers(conversationId, invitationData) {
        const config = {
            data: invitationData,
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.MEMBERS}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.LEGAL_HOLD_MISSING_CONSENT: {
                    throw new ConversationError_1.ConversationLegalholdMissingConsentError(backendError.message);
                }
            }
            throw error;
        }
    }
    /**
     * @deprecated Use `postService()` instead.
     */
    postBot(conversationId, providerId, serviceId) {
        return this.postService(conversationId, providerId, serviceId);
    }
    /**
     * Add a service to an existing conversation.
     * @param conversationId ID of the conversation to add services to
     * @param providerId ID of the service provider
     * @param serviceId ID of the service provider
     */
    async postService(conversationId, providerId, serviceId) {
        const config = {
            data: {
                provider: providerId,
                service: serviceId,
            },
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.BOTS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Create a new conversation
     * @param conversationData The new conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/createGroupConversation
     */
    async postConversation(conversationData) {
        const config = {
            data: conversationData,
            method: 'post',
            url: ConversationAPI.URL.CONVERSATIONS,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.LEGAL_HOLD_MISSING_CONSENT: {
                    throw new ConversationError_1.ConversationLegalholdMissingConsentError(backendError.message);
                }
            }
            throw error;
        }
    }
    /**
     * Create or recreate a conversation code.
     * @param conversationId ID of conversation to request the code for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/createConversationCode
     */
    async postConversationCodeRequest(conversationId) {
        const config = {
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.CODE}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Validate a conversation code.
     * @param conversationCode The conversation code
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/checkConversationCode
     */
    async postConversationCodeCheck(conversationCode) {
        const config = {
            data: conversationCode,
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}${ConversationAPI.URL.CODE_CHECK}`,
        };
        try {
            await this.client.sendJSON(config);
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.NO_CONVERSATION_CODE: {
                    throw new ConversationError_1.ConversationCodeNotFoundError(backendError.message);
                }
            }
            throw error;
        }
    }
    /**
     * Join a conversation by conversation code.
     * @param conversationCode The conversation code
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/joinConversationByCode
     */
    async postJoinByCode(conversationCode) {
        const config = {
            data: conversationCode,
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}${ConversationAPI.URL.JOIN}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.NO_CONVERSATION_CODE: {
                    throw new ConversationError_1.ConversationCodeNotFoundError(backendError.message);
                }
                case http_1.BackendErrorLabel.TOO_MANY_MEMBERS: {
                    throw new ConversationError_1.ConversationFullError(backendError.message);
                }
            }
            throw error;
        }
    }
    /**
     * Get information about a conversation by conversation code.
     * @param conversationCode The conversation code
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/joinConversationByCode
     */
    async getJoinByCode(conversationCode) {
        const config = {
            params: conversationCode,
            method: 'get',
            url: `${ConversationAPI.URL.CONVERSATIONS}${ConversationAPI.URL.JOIN}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.NO_CONVERSATION_CODE: {
                    throw new ConversationError_1.ConversationCodeNotFoundError(backendError.message);
                }
            }
            throw error;
        }
    }
    /**
     * Join a conversation.
     * @param conversationId The conversation ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/joinConversation
     */
    async postJoin(conversationId) {
        const config = {
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Post an encrypted message to a conversation.
     * @param sendingClientId The sender's client ID
     * @param conversationId The conversation ID
     * @param messageData The message content
     * @param ignoreMissing Whether to report missing clients or not:
     * `false`: Report about all missing clients
     * `true`: Ignore all missing clients and force sending.
     * Array: User IDs specifying which user IDs are allowed to have
     * missing clients
     * `undefined`: Default to setting of `report_missing` in `NewOTRMessage`
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/postOtrMessage
     */
    async postOTRMessage(sendingClientId, conversationId, messageData, ignoreMissing) {
        if (!sendingClientId) {
            throw new validation_1.ValidationError('Unable to send OTR message without client ID.');
        }
        messageData || (messageData = {
            recipients: {},
            sender: sendingClientId,
        });
        const config = {
            data: messageData,
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.OTR}/${ConversationAPI.URL.MESSAGES}`,
        };
        if (typeof ignoreMissing !== 'undefined') {
            const ignore_missing = Array.isArray(ignoreMissing) ? ignoreMissing.join(',') : ignoreMissing;
            config.params = { ignore_missing };
            // `ignore_missing` takes precedence on the server so we can remove
            // `report_missing` to save some bandwidth.
            delete messageData.report_missing;
        }
        else if (typeof messageData.report_missing === 'undefined' || !messageData.report_missing.length) {
            // both `ignore_missing` and `report_missing` are undefined
            config.params = { ignore_missing: !!messageData.data };
        }
        const response = await this.client.sendJSON(config, true);
        return response.data;
    }
    /**
     * This endpoint ensures that the list of clients is correct and only sends the message if the list is correct.
     * To override this, the endpoint accepts `client_mismatch_strategy` in the body. It can have these values:
     *
     * - `report_all`: When set, the message is not sent if any clients are missing. The missing clients are reported
     * in the response.
     * - `ignore_all`: When set, no checks about missing clients are carried out.
     * - `report_only`: Takes a list of qualified UserIDs. If any clients of the listed users are missing, the message is
     * not sent. The missing clients are reported in the response.
     * - `ignore_only`: Takes a list of qualified UserIDs. If any clients of the non-listed users are missing, the message
     * is not sent. The missing clients are reported in the response.
     *
     * The sending of messages in a federated conversation could theorectically fail partially. To make this case
     * unlikely, the backend first gets a list of clients from all the involved backends and then tries to send a message.
     * So, if any backend is down, the message is not propagated to anyone. But the actual message fan out to multiple
     * backends could still fail partially. This type of failure is reported as a 201, the clients for which the message
     * sending failed are part of the response body.
     *
     * This endpoint can lead to OtrMessageAdd event being sent to the recipients.
     *
     * @see https://nginz-https.anta.wire.link/api/swagger-ui/#/default/post_conversations__cnv_domain___cnv__proteus_messages
     */
    async postOTRMessageV2(conversationId, domain, messageData) {
        const config = {
            /*
             * We need to slice the content of what protobuf has generated in order for Axios to send the correct data (see https://github.com/axios/axios/issues/4068)
             * FIXME: The `slice` can be removed as soon as Axios publishes a version with the dataview issue fixed.
             */
            data: otr_1.proteus.QualifiedNewOtrMessage.encode(messageData).finish().slice(),
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${domain}/${conversationId}/${ConversationAPI.URL.PROTEUS}/${ConversationAPI.URL.MESSAGES}`,
        };
        const response = await this.client.sendProtocolBuffer(config, true);
        return response.data;
    }
    /**
     * Post an encrypted message to a conversation.
     * @param sendingClientId The sender's client ID
     * @param conversationId The conversation ID
     * @param messageData The message content
     * @param ignoreMissing Whether to report missing clients or not:
     * `false`: Report about all missing clients
     * `true`: Ignore all missing clients and force sending.
     * Array: User IDs specifying which user IDs are allowed to have
     * missing clients
     * `undefined`: Default to setting of `report_missing` in `NewOTRMessage`
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/postOtrMessage
     */
    async postOTRProtobufMessage(sendingClientId, conversationId, messageData, ignoreMissing) {
        if (!sendingClientId) {
            throw new validation_1.ValidationError('Unable to send OTR message without client ID.');
        }
        const config = {
            /*
             * We need to slice the content of what protobuf has generated in order for Axios to send the correct buffer (see https://github.com/axios/axios/issues/4068)
             * FIXME: The `slice` can be removed as soon as Axios publishes a version with the dataview issue fixed.
             */
            data: otr_1.proteus.NewOtrMessage.encode(messageData).finish().slice(),
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.OTR}/${ConversationAPI.URL.MESSAGES}`,
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
        const response = await this.client.sendProtocolBuffer(config, true);
        return response.data;
    }
    async postForClients(clientId, conversationId) {
        try {
            await this.postOTRMessage(clientId, conversationId);
            throw new Error(`Expected backend to throw error.`);
        }
        catch (error) {
            return error.response.data;
        }
    }
    /**
     * Create a self-conversation.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/createSelfConversation
     */
    async postSelf() {
        const config = {
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${ConversationAPI.URL.SELF}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Send typing notifications.
     * @param conversationId The Conversation ID to send notifications in
     * @param typingData The typing status
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/isTyping
     */
    async postTyping(conversationId, typingData) {
        const config = {
            data: typingData,
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.TYPING}`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Update access modes for a conversation.
     * @param conversationId The conversation ID to update the access mode of
     * @param accessData The new access data
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateConversationAccess
     */
    async putAccess(conversationId, accessData) {
        const config = {
            data: accessData,
            method: 'put',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.ACCESS}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Update conversation properties.
     * @param conversationId The conversation ID to update properties of
     * @param conversationNameData The new conversation name
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateConversation
     */
    async putConversation(conversationId, conversationNameData) {
        const config = {
            data: conversationNameData,
            method: 'put',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.NAME}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Update the message timer for a conversation.
     * @param conversationId The conversation ID
     * @param conversationData The new message timer
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateConversationMessageTimer
     */
    async putConversationMessageTimer(conversationId, messageTimerData) {
        const config = {
            data: messageTimerData,
            method: 'put',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.MESSAGE_TIMER}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Update the receipt mode for a conversation.
     * @param conversationId The conversation ID
     * @param receiptModeData The new receipt mode
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateConversationReceiptMode
     */
    async putConversationReceiptMode(conversationId, receiptModeData) {
        const config = {
            data: receiptModeData,
            method: 'put',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.RECEIPT_MODE}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Add users to an existing conversation.
     * @param conversationId The conversation ID to add the users to
     * @param userIds List of user IDs to add to a conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/addMembers
     */
    async postMembersV0(conversationId, userIds) {
        const config = {
            data: {
                conversation_role: ConversationRole_1.DefaultConversationRoleName.WIRE_MEMBER,
                users: userIds,
            },
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.MEMBERS}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.LEGAL_HOLD_MISSING_CONSENT: {
                    throw new ConversationError_1.ConversationLegalholdMissingConsentError(backendError.message);
                }
            }
            throw error;
        }
    }
    /**
     * Add qualified members to an existing conversation.
     * @param conversationId The conversation ID to add the users to
     * @param users List of users to add to a conversation
     */
    async postMembers(conversationId, users) {
        if (!this.backendFeatures.federationEndpoints) {
            return this.postMembersV0(conversationId, users.map(user => user.id));
        }
        const config = {
            data: {
                conversation_role: ConversationRole_1.DefaultConversationRoleName.WIRE_MEMBER,
                qualified_users: users,
            },
            method: 'post',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.MEMBERS}/${ConversationAPI.URL.V2}`,
        };
        try {
            const response = await this.client.sendJSON(config);
            return response.data;
        }
        catch (error) {
            const backendError = error;
            switch (backendError.label) {
                case http_1.BackendErrorLabel.LEGAL_HOLD_MISSING_CONSENT: {
                    throw new ConversationError_1.ConversationLegalholdMissingConsentError(backendError.message);
                }
            }
            throw error;
        }
    }
    /**
     * Update membership of the specified user in a certain conversation
     * @param userId The user ID
     * @param conversationId The conversation ID to change the user's membership in
     * @param memberUpdateData The new member data
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateOtherMember
     */
    async putOtherMember(userId, conversationId, memberUpdateData) {
        const config = {
            data: memberUpdateData,
            method: 'put',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.MEMBERS}/${userId}`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Update self membership properties.
     * @param conversationId The Conversation ID
     * @param memberData The new conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateSelf
     */
    async putMembershipProperties(conversationId, memberData) {
        const config = {
            data: memberData,
            method: 'put',
            url: `${ConversationAPI.URL.CONVERSATIONS}/${conversationId}/${ConversationAPI.URL.SELF}`,
        };
        await this.client.sendJSON(config);
    }
}
exports.ConversationAPI = ConversationAPI;
ConversationAPI.MAX_CHUNK_SIZE = 500;
ConversationAPI.URL = {
    ACCESS: 'access',
    BOTS: 'bots',
    CLIENTS: '/clients',
    CODE: 'code',
    CODE_CHECK: '/code-check',
    CONVERSATIONS: '/conversations',
    IDS: 'ids',
    JOIN: '/join',
    LIST: 'list',
    LIST_IDS: 'list-ids',
    MEMBERS: 'members',
    MESSAGE_TIMER: 'message-timer',
    MESSAGES: 'messages',
    NAME: 'name',
    OTR: 'otr',
    PROTEUS: 'proteus',
    RECEIPT_MODE: 'receipt-mode',
    ROLES: 'roles',
    SELF: 'self',
    TYPING: 'typing',
    V2: 'v2',
};
//# sourceMappingURL=ConversationAPI.js.map