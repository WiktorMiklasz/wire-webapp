import { proteus as ProtobufOTR } from '@wireapp/protocol-messaging/web/otr';
import type { ClientMismatch, MessageSendingStatus, NewOTRMessage } from '../conversation/';
import type { HttpClient } from '../http/';
export declare class BroadcastAPI {
    private readonly client;
    constructor(client: HttpClient);
    static readonly URL: {
        BROADCAST: string;
        BROADCAST_FEDERATED: string;
    };
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
    postBroadcastMessage(sendingClientId: string, messageData: NewOTRMessage<string>, ignoreMissing?: boolean | string[]): Promise<ClientMismatch>;
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
    postBroadcastProtobufMessage(sendingClientId: string, messageData: ProtobufOTR.NewOtrMessage, ignoreMissing?: boolean | string[]): Promise<ClientMismatch>;
    /**
     * Broadcast an encrypted message to all team members and all contacts in federated environments
     * @param sendingClientId The sender's client ID
     * @param messageData The message content
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/tab.html#!/postOtrBroadcast
     */
    postBroadcastFederatedMessage(sendingClientId: string, messageData: ProtobufOTR.QualifiedNewOtrMessage): Promise<MessageSendingStatus>;
}
