import { proteus as ProtobufOTR } from '@wireapp/protocol-messaging/web/otr';
import type { ClientMismatch, Conversation, ConversationCode, ConversationIds, ConversationRolesList, Conversations, Invite, Member, MessageSendingStatus, NewConversation, NewOTRMessage, RemoteConversations } from './';
import type { ConversationAccessUpdateEvent, ConversationCodeDeleteEvent, ConversationCodeUpdateEvent, ConversationEvent, ConversationMemberJoinEvent, ConversationMemberLeaveEvent, ConversationMessageTimerUpdateEvent, ConversationReceiptModeUpdateEvent, ConversationRenameEvent } from '../event/';
import { HttpClient } from '../http/';
import type { ConversationAccessUpdateData, ConversationAccessV2UpdateData, ConversationJoinData, ConversationMemberUpdateData, ConversationMessageTimerUpdateData, ConversationNameUpdateData, ConversationOtherMemberUpdateData, ConversationReceiptModeUpdateData, ConversationTypingData } from './data';
import { QualifiedId } from '../user';
import { BackendFeatures } from '../APIClient';
declare type ConversationGuestLinkStatus = {
    status: 'enabled' | 'disabled';
};
export declare class ConversationAPI {
    private readonly client;
    private readonly backendFeatures;
    static readonly MAX_CHUNK_SIZE = 500;
    static readonly URL: {
        ACCESS: string;
        BOTS: string;
        CLIENTS: string;
        CODE: string;
        CODE_CHECK: string;
        CONVERSATIONS: string;
        IDS: string;
        JOIN: string;
        LIST: string;
        LIST_IDS: string;
        MEMBERS: string;
        MESSAGE_TIMER: string;
        MESSAGES: string;
        NAME: string;
        OTR: string;
        PROTEUS: string;
        RECEIPT_MODE: string;
        ROLES: string;
        SELF: string;
        TYPING: string;
        V2: string;
    };
    constructor(client: HttpClient, backendFeatures: BackendFeatures);
    /**
     * Delete a conversation code.
     * @param conversationId ID of conversation to delete the code for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/deleteConversationCode
     */
    deleteConversationCode(conversationId: string): Promise<ConversationCodeDeleteEvent>;
    /**
     * @deprecated Use `deleteService()` instead.
     */
    deleteBot(conversationId: string, serviceId: string): Promise<void>;
    /**
     * Remove service from conversation.
     * @param conversationId The conversation ID to remove the service from
     * @param serviceId The ID of the service to be removed from the conversation
     */
    deleteService(conversationId: string, serviceId: string): Promise<void>;
    /**
     * Remove member from conversation.
     * @param conversationId The conversation ID to remove the user from
     * @param userId The user to remove
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/removeMember
     */
    deleteMember(conversationId: string | QualifiedId, userId: string | QualifiedId): Promise<ConversationMemberLeaveEvent>;
    /**
     * Get all conversations.
     * @deprecated - use getConversationList instead
     */
    getAllConversations(): Promise<Conversation[]>;
    /**
     * Get a conversation code.
     * @param conversationId ID of conversation to get the code for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/getConversationCode
     */
    getConversationCode(conversationId: string): Promise<ConversationCode>;
    getConversationGuestLinkFeature(conversationId: string): Promise<ConversationGuestLinkStatus>;
    getConversation(conversationId: string | QualifiedId): Promise<Conversation>;
    /**
     * Get a conversation by ID.
     * @param conversationId The conversation ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversation
     */
    private getConversation_v1;
    private getConversation_v2;
    /**
     * Get all qualified conversation IDs.
     * @param limit Max. number of qualified IDs to return
     */
    getQualifiedConversationIds(limit?: number): Promise<QualifiedId[]>;
    /**
     * Get all conversation IDs.
     * @param limit Max. number of IDs to return
     * @param conversationId Conversation ID to start from (exclusive)
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversationIds
     * @deprecated Use `getListConversations()` instead.
     */
    getConversationIds(limit: number, conversationId?: string): Promise<ConversationIds>;
    /**
     * Get conversations as chunks.
     * Note: At most 500 conversations are returned per request.
     * @param startConversationId Conversation ID to start from (exclusive). Mutually exclusive with `conversationIds`.
     * @param limit Max. number of conversations to return
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversations
     */
    getConversations(startConversationId?: string, limit?: number): Promise<Conversations>;
    /**
     * Get conversation metadata for a list of conversation qualified ids
     * @see https://staging-nginz-https.zinfra.io/api/swagger-ui/#/default/post_conversations_list_v2
     */
    getConversationsByQualifiedIds(conversations: QualifiedId[]): Promise<RemoteConversations>;
    /**
     * Get all local & remote conversations from a federated backend.
     */
    getConversationList(): Promise<Conversation[]>;
    /**
     * Get conversations.
     * Note: At most 500 conversations are returned per request.
     * @param conversationId Conversation ID to start from (exclusive). Mutually exclusive with `conversationIds`.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversations
     */
    getConversationsByIds(filteredConversationIds: string[]): Promise<Conversation[]>;
    /**
     * Get conversations.
     * Note: At most 500 conversations are returned per request.
     * @param startConversationId Conversation ID to start from (exclusive). Mutually exclusive with `conversationIds`.
     * @param filteredConversationIds Mutually exclusive with `startConversationId`. At most 32 IDs per request.
     * @param limit Max. number of conversations to return
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/conversations
     */
    private _getConversations;
    /**
     * Get existing roles available for the given conversation.
     * @param conversationId The Conversation ID to get roles for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/getConversationsRoles
     */
    getRoles(conversationId: string): Promise<ConversationRolesList>;
    /**
     * Get self membership properties.
     * @param conversationId The Conversation ID to get properties for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/getSelf
     */
    getMembershipProperties(conversationId: string): Promise<Member>;
    /**
     * Create a 1:1-conversation.
     * @param conversationData The new conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/createOne2OneConversation
     */
    post1to1(conversationData: NewConversation): Promise<void>;
    /**
     * Add users to an existing conversation.
     * @param conversationId The conversation ID
     * @param invitationData The new conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/addMembers
     */
    postAddMembers(conversationId: string, invitationData: Invite): Promise<ConversationEvent>;
    /**
     * @deprecated Use `postService()` instead.
     */
    postBot(conversationId: string, providerId: string, serviceId: string): Promise<ConversationMemberJoinEvent>;
    /**
     * Add a service to an existing conversation.
     * @param conversationId ID of the conversation to add services to
     * @param providerId ID of the service provider
     * @param serviceId ID of the service provider
     */
    postService(conversationId: string, providerId: string, serviceId: string): Promise<ConversationMemberJoinEvent>;
    /**
     * Create a new conversation
     * @param conversationData The new conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/createGroupConversation
     */
    postConversation(conversationData: NewConversation): Promise<Conversation>;
    /**
     * Create or recreate a conversation code.
     * @param conversationId ID of conversation to request the code for
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/createConversationCode
     */
    postConversationCodeRequest(conversationId: string): Promise<ConversationCodeUpdateEvent>;
    /**
     * Validate a conversation code.
     * @param conversationCode The conversation code
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/checkConversationCode
     */
    postConversationCodeCheck(conversationCode: ConversationCode): Promise<void>;
    /**
     * Join a conversation by conversation code.
     * @param conversationCode The conversation code
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/joinConversationByCode
     */
    postJoinByCode(conversationCode: ConversationCode): Promise<ConversationMemberJoinEvent>;
    /**
     * Get information about a conversation by conversation code.
     * @param conversationCode The conversation code
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/joinConversationByCode
     */
    getJoinByCode(conversationCode: Omit<ConversationCode, 'uri'>): Promise<ConversationJoinData>;
    /**
     * Join a conversation.
     * @param conversationId The conversation ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/joinConversation
     */
    postJoin(conversationId: string): Promise<ConversationEvent>;
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
    postOTRMessage(sendingClientId: string, conversationId: string, messageData?: NewOTRMessage<string>, ignoreMissing?: boolean | string[]): Promise<ClientMismatch>;
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
    postOTRMessageV2(conversationId: string, domain: string, messageData: ProtobufOTR.QualifiedNewOtrMessage): Promise<MessageSendingStatus>;
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
    postOTRProtobufMessage(sendingClientId: string, conversationId: string, messageData: ProtobufOTR.NewOtrMessage, ignoreMissing?: boolean | string[]): Promise<ClientMismatch>;
    postForClients(clientId: string, conversationId: string): Promise<ClientMismatch>;
    /**
     * Create a self-conversation.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/createSelfConversation
     */
    postSelf(): Promise<Conversation>;
    /**
     * Send typing notifications.
     * @param conversationId The Conversation ID to send notifications in
     * @param typingData The typing status
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/isTyping
     */
    postTyping(conversationId: string, typingData: ConversationTypingData): Promise<void>;
    /**
     * Update access modes for a conversation.
     * @param conversationId The conversation ID to update the access mode of
     * @param accessData The new access data
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateConversationAccess
     */
    putAccess(conversationId: string, accessData: ConversationAccessUpdateData | ConversationAccessV2UpdateData): Promise<ConversationAccessUpdateEvent>;
    /**
     * Update conversation properties.
     * @param conversationId The conversation ID to update properties of
     * @param conversationNameData The new conversation name
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateConversation
     */
    putConversation(conversationId: string, conversationNameData: ConversationNameUpdateData): Promise<ConversationRenameEvent>;
    /**
     * Update the message timer for a conversation.
     * @param conversationId The conversation ID
     * @param conversationData The new message timer
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateConversationMessageTimer
     */
    putConversationMessageTimer(conversationId: string, messageTimerData: ConversationMessageTimerUpdateData): Promise<ConversationMessageTimerUpdateEvent>;
    /**
     * Update the receipt mode for a conversation.
     * @param conversationId The conversation ID
     * @param receiptModeData The new receipt mode
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateConversationReceiptMode
     */
    putConversationReceiptMode(conversationId: string, receiptModeData: ConversationReceiptModeUpdateData): Promise<ConversationReceiptModeUpdateEvent>;
    /**
     * Add users to an existing conversation.
     * @param conversationId The conversation ID to add the users to
     * @param userIds List of user IDs to add to a conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/addMembers
     */
    private postMembersV0;
    /**
     * Add qualified members to an existing conversation.
     * @param conversationId The conversation ID to add the users to
     * @param users List of users to add to a conversation
     */
    postMembers(conversationId: string, users: QualifiedId[]): Promise<ConversationMemberJoinEvent>;
    /**
     * Update membership of the specified user in a certain conversation
     * @param userId The user ID
     * @param conversationId The conversation ID to change the user's membership in
     * @param memberUpdateData The new member data
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateOtherMember
     */
    putOtherMember(userId: string, conversationId: string, memberUpdateData: ConversationOtherMemberUpdateData): Promise<void>;
    /**
     * Update self membership properties.
     * @param conversationId The Conversation ID
     * @param memberData The new conversation
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/conversations/updateSelf
     */
    putMembershipProperties(conversationId: string, memberData: Partial<ConversationMemberUpdateData>): Promise<void>;
}
export {};
