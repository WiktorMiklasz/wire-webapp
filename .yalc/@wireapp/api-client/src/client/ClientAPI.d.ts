import type { PreKeyBundle } from '../auth/';
import type { CreateClientPayload, RegisteredClient, UpdateClientPayload } from '../client/';
import { HttpClient } from '../http/';
import { ClientCapabilityData } from './ClientCapabilityData';
export declare class ClientAPI {
    private readonly client;
    constructor(client: HttpClient);
    static readonly URL: {
        CLIENTS: string;
        CAPABILITIES: string;
        PREKEYS: string;
    };
    postClient(newClient: CreateClientPayload): Promise<RegisteredClient>;
    putClient(clientId: string, updatedClient: UpdateClientPayload): Promise<void>;
    getClientCapabilities(clientId: string): Promise<ClientCapabilityData>;
    deleteClient(clientId: string, password?: string): Promise<void>;
    getClient(clientId: string): Promise<RegisteredClient>;
    getClients(): Promise<RegisteredClient[]>;
    getClientPreKeys(clientId: string): Promise<PreKeyBundle>;
}
