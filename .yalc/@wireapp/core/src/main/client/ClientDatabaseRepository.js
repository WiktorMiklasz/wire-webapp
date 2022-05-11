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
exports.ClientDatabaseRepository = exports.DatabaseStores = void 0;
var DatabaseStores;
(function (DatabaseStores) {
    DatabaseStores["CLIENTS"] = "clients";
})(DatabaseStores = exports.DatabaseStores || (exports.DatabaseStores = {}));
class ClientDatabaseRepository {
    constructor(storeEngine, cryptographyService) {
        this.storeEngine = storeEngine;
        this.cryptographyService = cryptographyService;
    }
    getLocalClient() {
        return this.getClient(ClientDatabaseRepository.KEYS.LOCAL_IDENTITY);
    }
    getClient(sessionId) {
        return this.storeEngine.read(ClientDatabaseRepository.STORES.CLIENTS, sessionId);
    }
    deleteLocalClient() {
        return this.storeEngine.delete(ClientDatabaseRepository.STORES.CLIENTS, ClientDatabaseRepository.KEYS.LOCAL_IDENTITY);
    }
    deleteClient(sessionId) {
        return this.storeEngine.delete(ClientDatabaseRepository.STORES.CLIENTS, sessionId);
    }
    createClientList(userId, clientList, domain) {
        const createClientTasks = [];
        for (const client of clientList) {
            createClientTasks.push(this.createClient(userId, client, domain));
        }
        return Promise.all(createClientTasks);
    }
    async createLocalClient(client, domain) {
        const transformedClient = this.transformLocalClient(client, domain);
        await this.storeEngine.create(ClientDatabaseRepository.STORES.CLIENTS, ClientDatabaseRepository.KEYS.LOCAL_IDENTITY, transformedClient);
        return transformedClient;
    }
    async updateLocalClient(client, domain) {
        const transformedClient = this.transformLocalClient(client, domain);
        await this.storeEngine.update(ClientDatabaseRepository.STORES.CLIENTS, ClientDatabaseRepository.KEYS.LOCAL_IDENTITY, transformedClient);
        return transformedClient;
    }
    async updateClient(userId, client, domain) {
        const transformedClient = this.transformClient(userId, client, false, domain);
        await this.storeEngine.update(ClientDatabaseRepository.STORES.CLIENTS, this.cryptographyService.constructSessionId(userId, client.id, domain), transformedClient);
        return transformedClient;
    }
    async createClient(userId, client, domain) {
        const transformedClient = this.transformClient(userId, client, false, domain);
        await this.storeEngine.create(ClientDatabaseRepository.STORES.CLIENTS, this.cryptographyService.constructSessionId(userId, client.id, domain), transformedClient);
        return transformedClient;
    }
    transformClient(userId, client, verified, domain) {
        return Object.assign(Object.assign({}, client), { domain, meta: {
                is_verified: verified,
                primary_key: this.cryptographyService.constructSessionId(userId, client.id, domain),
            } });
    }
    transformLocalClient(client, domain) {
        return Object.assign(Object.assign({}, client), { domain, meta: { is_verified: true, primary_key: ClientDatabaseRepository.KEYS.LOCAL_IDENTITY } });
    }
}
exports.ClientDatabaseRepository = ClientDatabaseRepository;
ClientDatabaseRepository.STORES = DatabaseStores;
ClientDatabaseRepository.KEYS = {
    LOCAL_IDENTITY: 'local_identity',
};
//# sourceMappingURL=ClientDatabaseRepository.js.map