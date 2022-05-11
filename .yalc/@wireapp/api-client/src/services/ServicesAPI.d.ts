import type { HttpClient, ProgressCallback } from '../http';
import type { Client, Self, UserPreKeyList, UserPreKeyDataList, UserSeenByService, ClientSeenByService, ServiceMessage } from './Service';
import type { PreKey } from '../auth';
import { AssetOptions } from '../asset';
export declare class ServicesAPI {
    private readonly client;
    private readonly assetAPI;
    constructor(client: HttpClient);
    static readonly URL: {
        ASSETS: string;
        BOT: string;
        CLIENT: string;
        CLIENTS: string;
        CONVERSATION: string;
        MESSAGES: string;
        PREKEYS: string;
        SELF: string;
        USERS: string;
    };
    /**
     * Delete the service, thereby removing it from the conversation it is in.
     *
     * The service will receive a final `conversation.member-leave` message.
     */
    deleteSelf(): Promise<void>;
    /**
     * Fetch the service's own client information
     */
    getClient(): Promise<Client>;
    /**
     * List the service's remaining prekey IDs.
     */
    getClientPreKeys(): Promise<number[]>;
    /**
     * Fetch a user's list of clients.
     */
    getClientsByUserId(userId: string): Promise<ClientSeenByService[]>;
    /**
     * Fetch a user's list of clients.
     */
    getConversation(userId: string): Promise<ClientSeenByService[]>;
    /**
     * Fetch the service's own user profile information.
     */
    getSelf(): Promise<Self>;
    /**
     * Claim prekeys from one or more clients of one or more users.
     *
     * The result is a nested JSON object structure where the first-level keys
     * are user IDs and the second-level keys client IDs. The values paired with
     * the client IDs are the base64-encoded prekeys.
     */
    postUserPreKeysList(userPreKeyList: UserPreKeyList): Promise<UserPreKeyDataList>;
    /**
     * Fetch other user's profiles.
     */
    getUsers(ids: string[]): Promise<UserSeenByService[]>;
    /**
     * List the service's remaining prekey IDs.
     */
    postClientPreKeys(preKeys: PreKey[]): Promise<void>;
    /**
     * Upload an asset.
     * Note that resumable uploads are not currently supported for services.
     */
    postAsset(asset: Uint8Array, options?: AssetOptions, progressCallback?: ProgressCallback): import("../http").RequestCancelable<import("../asset").AssetUploadData>;
    /**
     * Download an asset.
     */
    getAsset(assetId: string, token?: string | null, forceCaching?: boolean, progressCallback?: ProgressCallback): import("../http").RequestCancelable<import("../asset").AssetResponse>;
    /**
     * Delete an asset.
     */
    deleteAsset(assetId: string): Promise<void>;
    /**
     * Post an end-to-end encrypted generic message to the conversation the service is in.
     */
    postMessage(messageData: ServiceMessage): Promise<void>;
}
