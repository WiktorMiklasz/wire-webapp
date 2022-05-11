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
exports.UserAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const commons_1 = require("@wireapp/commons");
const http_1 = require("../http/");
const UserError_1 = require("./UserError");
class UserAPI {
    constructor(client, backendFeatures) {
        this.client = client;
        this.backendFeatures = backendFeatures;
    }
    /**
     * Clear all properties.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/clearProperties
     */
    async deleteProperties() {
        const config = {
            method: 'delete',
            url: UserAPI.URL.PROPERTIES,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Delete a property.
     * @param propertyKey The property key to delete
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/deleteProperty
     */
    async deleteProperty(propertyKey) {
        const config = {
            method: 'delete',
            url: `${UserAPI.URL.PROPERTIES}/${propertyKey}`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Activate (i.e. confirm) an email address or phone number.
     * @param activationCode Activation code
     * @param activationKey Activation key
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/activate
     */
    async getActivation(activationCode, activationKey) {
        const config = {
            method: 'get',
            params: {
                code: activationCode,
                key: activationKey,
            },
            url: UserAPI.URL.ACTIVATE,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Retrieve TURN server addresses and credentials.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getCallsConfig
     */
    async getCallsConfiguration() {
        const config = {
            method: 'get',
            url: `${UserAPI.URL.CALLS}/${UserAPI.URL.CONFIG}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get a specific client of a user.
     * @param userId The user ID
     * @param clientId The client ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getUserClient
     */
    async getClient(userId, clientId) {
        const strUserId = typeof userId === 'string' ? userId : userId.id;
        const url = this.backendFeatures.federationEndpoints && typeof userId !== 'string'
            ? `${UserAPI.URL.USERS}/${userId.domain}/${userId.id}/${UserAPI.URL.CLIENTS}/${clientId}`
            : `${UserAPI.URL.USERS}/${strUserId}/${UserAPI.URL.CLIENTS}/${clientId}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get a prekey for a specific client of a user.
     * @param userId The user ID
     * @param clientId The client ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getPrekey
     */
    async getClientPreKey(userId, clientId) {
        if (this.backendFeatures.federationEndpoints && typeof userId !== 'string') {
            return this.getClientPreKey_v2(userId, clientId);
        }
        const strUserId = typeof userId === 'string' ? userId : userId.id;
        return this.getClientPreKey_v1(strUserId, clientId);
    }
    async getClientPreKey_v1(userId, clientId) {
        const url = `${UserAPI.URL.USERS}/${userId}/${UserAPI.URL.PRE_KEYS}/${clientId}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getClientPreKey_v2(userId, clientId) {
        const { id, domain } = userId;
        const url = `${UserAPI.URL.USERS}/${domain}/${id}/${UserAPI.URL.PRE_KEYS}/${clientId}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get all of a user's clients.
     * @param userId The user ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getUserClients
     */
    async getClients(userId) {
        const strUserId = typeof userId === 'string' ? userId : userId.id;
        const url = this.backendFeatures.federationEndpoints && typeof userId !== 'string'
            ? `${UserAPI.URL.USERS}/${userId.domain}/${userId.id}/${UserAPI.URL.CLIENTS}`
            : `${UserAPI.URL.USERS}/${strUserId}/${UserAPI.URL.CLIENTS}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get information on a user handle.
     * @param handle The user's handle
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getUserHandleInfo
     */
    async getHandle(handle) {
        const config = {
            method: 'get',
            url: `${UserAPI.URL.USERS}/${UserAPI.URL.HANDLES}/${handle}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * List all property keys.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/listPropertyKeys
     */
    async getProperties() {
        const config = {
            method: 'get',
            url: UserAPI.URL.PROPERTIES,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get a property value.
     * @param propertyKey The property key to get
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getProperty
     */
    async getProperty(propertyKey) {
        const config = {
            method: 'get',
            url: `${UserAPI.URL.PROPERTIES}/${propertyKey}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Search for users.
     * @param query The search query
     * @param domain The domain where the user should be hosted
     * @param limit Number of results to return
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/search
     */
    async getSearchContacts(query, limit, domain) {
        const cancelSource = axios_1.default.CancelToken.source();
        const config = {
            cancelToken: cancelSource.token,
            method: 'get',
            params: {
                q: query,
            },
            url: `${UserAPI.URL.SEARCH}/${UserAPI.URL.CONTACTS}`,
        };
        if (domain) {
            config.params.domain = domain;
        }
        if (limit) {
            config.params.size = limit;
        }
        const handleRequest = async () => {
            try {
                const response = await this.client.sendJSON(config);
                return response.data;
            }
            catch (error) {
                if (error.message === http_1.SyntheticErrorLabel.REQUEST_CANCELLED) {
                    throw new UserError_1.RequestCancellationError('Search request got cancelled');
                }
                throw error;
            }
        };
        return {
            cancel: () => cancelSource.cancel(http_1.SyntheticErrorLabel.REQUEST_CANCELLED),
            response: handleRequest(),
        };
    }
    /**
     * Get a user by ID.
     * @note If you want to get all properties (`sso_id`, `managed_by`, etc.) for your own user, use "/self".
     *       Otherwise you will get a user payload with a limited set of properties (what's publicly available).
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/user
     */
    async getUser(userId) {
        const url = typeof userId === 'string'
            ? `${UserAPI.URL.USERS}/${userId}`
            : `${UserAPI.URL.USERS}/${userId.domain}/${userId.id}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async getUserPreKeys(userId) {
        const url = typeof userId === 'string'
            ? `${UserAPI.URL.USERS}/${userId}/${UserAPI.URL.PRE_KEYS}`
            : `${UserAPI.URL.USERS}/${userId.domain}/${userId.id}/${UserAPI.URL.PRE_KEYS}`;
        const config = {
            method: 'get',
            url,
        };
        const response = await this.client.sendJSON(config, true);
        return response.data;
    }
    /**
     * List users.
     * Note: The 'ids' and 'handles' parameters are mutually exclusive.
     * @param parameters Multiple user's handles or IDs
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/users
     */
    async getUsers(parameters, limit = UserAPI.DEFAULT_USERS_CHUNK_SIZE) {
        const fetchUsers = async (params) => {
            const config = {
                method: 'get',
                params: {},
                url: UserAPI.URL.USERS,
            };
            if ('handles' in params) {
                config.params.handles = params.handles.join(',');
            }
            else if ('ids' in params) {
                config.params.ids = params.ids.join(',');
            }
            const response = await this.client.sendJSON(config);
            return response.data;
        };
        if ('handles' in parameters && parameters.handles.length) {
            const uniqueHandles = commons_1.ArrayUtil.removeDuplicates(parameters.handles);
            const handleChunks = commons_1.ArrayUtil.chunk(uniqueHandles, limit);
            const resolvedTasks = await Promise.all(handleChunks.map(handleChunk => fetchUsers({ handles: handleChunk })));
            return commons_1.ArrayUtil.flatten(resolvedTasks);
        }
        if ('ids' in parameters && parameters.ids.length) {
            const uniqueIds = commons_1.ArrayUtil.removeDuplicates(parameters.ids);
            const idChunks = commons_1.ArrayUtil.chunk(uniqueIds, limit);
            const resolvedTasks = await Promise.all(idChunks.map(idChunk => fetchUsers({ ids: idChunk })));
            return commons_1.ArrayUtil.flatten(resolvedTasks);
        }
        return [];
    }
    /**
     * List users.
     * @param userIds Multiple user's IDs
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/users
     */
    async getUsersByIds(userIds) {
        const maxChunkSize = 100;
        return this.getUsers({ ids: userIds }, maxChunkSize);
    }
    /**
     * Check if a user ID exists.
     */
    async headUsers(userId) {
        const url = typeof userId === 'string'
            ? `${UserAPI.URL.USERS}/${userId}`
            : `${UserAPI.URL.USERS}/${userId.domain}/${userId.id}`;
        const config = {
            method: 'head',
            url,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Activate (i.e. confirm) an email address or phone number.
     * Note: Activation only succeeds once and the number of failed attempts for a valid key is limited.
     * @param activationData Data to activate an account
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/activate_0
     */
    async postActivation(activationData) {
        const config = {
            data: activationData,
            method: 'post',
            url: UserAPI.URL.ACTIVATE,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Send (or resend) an email or phone activation code.
     * @param activationCodeData Data to send an activation code
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/sendActivationCode
     */
    async postActivationCode(activationCodeData) {
        const config = {
            data: activationCodeData,
            method: 'post',
            url: `${UserAPI.URL.ACTIVATE}/${UserAPI.URL.SEND}`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Generates a verification code to be sent to the email address provided
     * @param email users email address
     * @param action whether the action is for a SCIM code generation or a user login
     */
    async postVerificationCode(email, action) {
        const config = {
            data: { email, action },
            method: 'post',
            url: `${UserAPI.URL.VERIFICATION}/${UserAPI.URL.SEND}`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Verify account deletion with a code.
     * @param verificationData Data to verify the account deletion
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/verifyDeleteUser
     */
    async postDelete(verificationData) {
        const config = {
            data: verificationData,
            method: 'post',
            url: UserAPI.URL.DELETE,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Check availability of user handles.
     * @param handles The handles to check
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/checkUserHandles
     */
    async postHandles(handles) {
        const config = {
            data: handles,
            method: 'post',
            url: `${UserAPI.URL.USERS}/${UserAPI.URL.HANDLES}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Check availability of a single user handle.
     * @param handle The handle to check
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/checkUserHandle
     */
    async headHandle(handle) {
        const config = {
            method: 'head',
            url: `${UserAPI.URL.USERS}/${UserAPI.URL.HANDLES}/${handle}`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Get a user by fully qualified handle.
     * @param handle The handle of a user to search for
     */
    async getUserByHandle(handle) {
        const config = {
            method: 'get',
            url: `${UserAPI.URL.USERS}/${UserAPI.URL.BY_HANDLE}/${handle.domain}/${handle.handle}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    async postMultiPreKeyBundlesChunk(userClientMap) {
        const config = {
            data: userClientMap,
            method: 'post',
            url: `${UserAPI.URL.USERS}/${UserAPI.URL.PRE_KEYS}`,
        };
        const response = await this.client.sendJSON(config, true);
        return response.data;
    }
    async postMultiQualifiedPreKeyBundlesChunk(userClientMap) {
        const config = {
            data: userClientMap,
            method: 'post',
            url: `${UserAPI.URL.USERS}/${UserAPI.URL.LIST_PREKEYS}`,
        };
        const response = await this.client.sendJSON(config, true);
        return response.data;
    }
    /**
     * List users.
     * Note: The 'qualified_ids' and 'qualified_handles' parameters are mutually exclusive.
     */
    async postListUsers(users) {
        const config = {
            data: users,
            method: 'post',
            url: UserAPI.URL.LIST_USERS,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Get client infos from a list of users.
     */
    async postListClients(userIdList) {
        const config = {
            data: userIdList,
            method: 'post',
            url: `${UserAPI.URL.USERS}/${UserAPI.URL.LIST_CLIENTS}/${UserAPI.URL.V2}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Given a map of user IDs to client IDs return a prekey for each one.
     * @param userClientMap A map of the user's clients
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getMultiPrekeyBundles
     */
    async postMultiPreKeyBundles(userClientMap, limit = UserAPI.DEFAULT_USERS_PREKEY_BUNDLE_CHUNK_SIZE) {
        const userIdChunks = commons_1.ArrayUtil.chunk(Object.keys(userClientMap), limit);
        const chunksPromises = userIdChunks.map(userIdChunk => {
            const rebuiltMap = userIdChunk.reduce((chunkedUserClientMap, userId) => {
                chunkedUserClientMap[userId] = userClientMap[userId];
                return chunkedUserClientMap;
            }, {});
            return this.postMultiPreKeyBundlesChunk(rebuiltMap);
        });
        const userPreKeyBundleMapChunks = await Promise.all(chunksPromises);
        return userPreKeyBundleMapChunks.reduce((userPreKeyBundleMap, userPreKeyBundleMapChunk) => {
            return Object.assign(Object.assign({}, userPreKeyBundleMap), userPreKeyBundleMapChunk);
        }, {});
    }
    /**
     * Given a map of qualified user IDs to client IDs return a prekey for each one.
     * @param userClientMap A map of the qualified user's clients
     */
    async postQualifiedMultiPreKeyBundles(userClientMap, limit = UserAPI.DEFAULT_USERS_PREKEY_BUNDLE_CHUNK_SIZE) {
        const flattenUsers = Object.entries(userClientMap).reduce((users, [domain, domainUsersClients]) => {
            const domainUsers = Object.entries(domainUsersClients).map(([userId, clients]) => ({
                userId: { id: userId, domain },
                clients,
            }));
            return users.concat(domainUsers);
        }, []);
        const chunksPromises = commons_1.ArrayUtil.chunk(flattenUsers, limit)
            .map(chunk => {
            return chunk.reduce((chunkedMap, { userId, clients }) => {
                return Object.assign(Object.assign({}, chunkedMap), { [userId.domain]: Object.assign(Object.assign({}, chunkedMap[userId.domain]), { [userId.id]: clients }) });
            }, {});
        })
            .map(chunkedMap => this.postMultiQualifiedPreKeyBundlesChunk(chunkedMap));
        const userPreKeyBundleMapChunks = await Promise.all(chunksPromises);
        return userPreKeyBundleMapChunks.reduce((userPreKeyBundleMap, userPreKeyBundleMapChunk) => {
            Object.entries(userPreKeyBundleMapChunk).forEach(([domain, userClientMap]) => {
                userPreKeyBundleMap[domain] = Object.assign(Object.assign({}, userPreKeyBundleMap[domain]), userClientMap);
            });
            return userPreKeyBundleMap;
        }, {});
    }
    /**
     * Initiate or complete a password reset.
     * @param resetData The data needed to initiate or complete the reset
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/beginPasswordReset
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/completePasswordReset
     */
    async postPasswordReset(resetData) {
        const config = {
            data: resetData,
            method: 'post',
            url: UserAPI.URL.PASSWORD_RESET,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Set a user property.
     * @param propertyKey The property key to set
     * @param propertyData The property data to set
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/setProperty
     */
    async putProperty(propertyKey, propertyData) {
        const config = {
            data: propertyData,
            method: 'put',
            url: `${UserAPI.URL.PROPERTIES}/${propertyKey}`,
        };
        await this.client.sendJSON(config);
    }
    /**
     * Get rich info of a user
     * @param userId The user ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getRichInfo
     */
    async getRichInfo(userId) {
        const config = {
            method: 'get',
            url: `${UserAPI.URL.USERS}/${userId}/${UserAPI.URL.RICH_INFO}`,
        };
        const response = await this.client.sendJSON(config);
        return response.data;
    }
    /**
     * Resend email address validation
     * @param userId The user ID
     * @see https://staging-nginz-https.zinfra.io/api/swagger-ui/#/default/put_users__uid__email
     */
    async putRevalidateEmail(userId, email) {
        const config = {
            data: { email },
            method: 'put',
            url: `${UserAPI.URL.USERS}/${userId}/${UserAPI.URL.EMAIL}`,
        };
        await this.client.sendJSON(config);
    }
}
exports.UserAPI = UserAPI;
UserAPI.DEFAULT_USERS_CHUNK_SIZE = 50;
UserAPI.DEFAULT_USERS_PREKEY_BUNDLE_CHUNK_SIZE = 128;
UserAPI.URL = {
    ACTIVATE: '/activate',
    BY_HANDLE: 'by-handle',
    CALLS: '/calls',
    CLIENTS: 'clients',
    CONFIG: 'config',
    CONTACTS: 'contacts',
    DELETE: '/delete',
    EMAIL: 'email',
    HANDLES: 'handles',
    LIST_CLIENTS: 'list-clients',
    LIST_PREKEYS: 'list-prekeys',
    LIST_USERS: '/list-users',
    PASSWORD_RESET: '/password-reset',
    PRE_KEYS: 'prekeys',
    PROPERTIES: '/properties',
    RICH_INFO: 'rich-info',
    SEARCH: '/search',
    SEND: 'send',
    USERS: '/users',
    V2: 'v2',
    VERIFICATION: '/verification-code',
};
//# sourceMappingURL=UserAPI.js.map