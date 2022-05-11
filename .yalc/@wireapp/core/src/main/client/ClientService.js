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
exports.ClientService = void 0;
const client_1 = require("@wireapp/api-client/src/client/");
const _1 = require("./");
class ClientService {
    constructor(apiClient, storeEngine, cryptographyService) {
        this.apiClient = apiClient;
        this.storeEngine = storeEngine;
        this.cryptographyService = cryptographyService;
        this.database = new _1.ClientDatabaseRepository(this.storeEngine, this.cryptographyService);
        this.backend = new _1.ClientBackendRepository(this.apiClient);
    }
    deleteLocalClient() {
        return this.database.deleteLocalClient();
    }
    getClients() {
        return this.backend.getClients();
    }
    getLocalClient() {
        return this.database.getLocalClient();
    }
    createLocalClient(client, domain) {
        return this.database.createLocalClient(client, domain);
    }
    async synchronizeClients() {
        var _a;
        const registeredClients = await this.backend.getClients();
        const filteredClients = registeredClients.filter(client => client.id !== this.apiClient.context.clientId);
        return this.database.createClientList(this.apiClient.context.userId, filteredClients, (_a = this.apiClient.context) === null || _a === void 0 ? void 0 : _a.domain);
    }
    // TODO: Split functionality into "create" and "register" client
    async register(loginData, clientInfo = {
        classification: client_1.ClientClassification.DESKTOP,
        cookieLabel: 'default',
        model: '@wireapp/core',
    }, entropyData) {
        if (!this.apiClient.context) {
            throw new Error('Context is not set.');
        }
        if (loginData.clientType === client_1.ClientType.NONE) {
            throw new Error(`Can't register client of type "${client_1.ClientType.NONE}"`);
        }
        const serializedPreKeys = await this.cryptographyService.createCryptobox(entropyData);
        if (!this.cryptographyService.cryptobox.lastResortPreKey) {
            throw new Error('Cryptobox got initialized without a last resort PreKey.');
        }
        const newClient = {
            class: clientInfo.classification,
            cookie: clientInfo.cookieLabel,
            label: clientInfo.label,
            lastkey: this.cryptographyService.cryptobox.serialize_prekey(this.cryptographyService.cryptobox.lastResortPreKey),
            location: clientInfo.location,
            model: clientInfo.model,
            password: loginData.password ? String(loginData.password) : undefined,
            verification_code: loginData.verificationCode,
            prekeys: serializedPreKeys,
            type: loginData.clientType,
        };
        const client = await this.backend.postClient(newClient);
        await this.createLocalClient(client, this.apiClient.context.domain);
        return client;
    }
    /**
     * Will make the given client mls capable (generate and upload key packages)
     *
     * @param mlsClient Intance of the coreCrypto that represents the mls client
     * @param clientId The id of the client
     */
    async uploadMLSKeyPackages(mlsClient, clientId) {
        const keyPackages = mlsClient.clientKeypackages(100).map(key => key.toString());
        return this.backend.putClient(clientId, {
            mls_public_keys: { ed25519: keyPackages },
        });
    }
}
exports.ClientService = ClientService;
//# sourceMappingURL=ClientService.js.map