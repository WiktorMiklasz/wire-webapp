import type { APIClient } from '@wireapp/api-client';
import type { LoginData } from '@wireapp/api-client/src/auth/';
import { RegisteredClient } from '@wireapp/api-client/src/client/';
import type { CRUDEngine } from '@wireapp/store-engine';
import type { CoreCrypto } from '../CoreCrypto';
import type { CryptographyService } from '../cryptography/';
import { ClientInfo } from './';
export interface MetaClient extends RegisteredClient {
    domain?: string;
    meta: {
        is_verified?: boolean;
        primary_key: string;
    };
}
export declare class ClientService {
    private readonly apiClient;
    private readonly storeEngine;
    private readonly cryptographyService;
    private readonly database;
    private readonly backend;
    constructor(apiClient: APIClient, storeEngine: CRUDEngine, cryptographyService: CryptographyService);
    deleteLocalClient(): Promise<string>;
    getClients(): Promise<RegisteredClient[]>;
    getLocalClient(): Promise<MetaClient>;
    createLocalClient(client: RegisteredClient, domain?: string): Promise<MetaClient>;
    synchronizeClients(): Promise<MetaClient[]>;
    register(loginData: LoginData, clientInfo?: ClientInfo, entropyData?: Uint8Array): Promise<RegisteredClient>;
    /**
     * Will make the given client mls capable (generate and upload key packages)
     *
     * @param mlsClient Intance of the coreCrypto that represents the mls client
     * @param clientId The id of the client
     */
    uploadMLSKeyPackages(mlsClient: CoreCrypto, clientId: string): Promise<void>;
}
