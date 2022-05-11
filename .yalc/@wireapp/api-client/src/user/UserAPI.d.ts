import { HttpClient, RequestCancelable } from '../http/';
import type { Activate, ActivationResponse, CheckHandles, CompletePasswordReset, HandleInfo, LimitedQualifiedUserIdList, NewPasswordReset, QualifiedHandle, QualifiedId, SearchResult, SendActivationCode, User, UserPreKeyBundleMap, VerifyDelete } from '../user/';
import type { ClientPreKey, PreKeyBundle } from '../auth/';
import type { PublicClient, QualifiedPublicClients } from '../client/';
import type { RichInfo } from './RichInfo';
import type { UserClients, QualifiedUserClients } from '../conversation/';
import type { QualifiedUserPreKeyBundleMap } from './UserPreKeyBundleMap';
import { VerificationActionType } from '../auth/VerificationActionType';
import { BackendFeatures } from '../APIClient';
export declare class UserAPI {
    private readonly client;
    private readonly backendFeatures;
    static readonly DEFAULT_USERS_CHUNK_SIZE = 50;
    static readonly DEFAULT_USERS_PREKEY_BUNDLE_CHUNK_SIZE = 128;
    static readonly URL: {
        ACTIVATE: string;
        BY_HANDLE: string;
        CALLS: string;
        CLIENTS: string;
        CONFIG: string;
        CONTACTS: string;
        DELETE: string;
        EMAIL: string;
        HANDLES: string;
        LIST_CLIENTS: string;
        LIST_PREKEYS: string;
        LIST_USERS: string;
        PASSWORD_RESET: string;
        PRE_KEYS: string;
        PROPERTIES: string;
        RICH_INFO: string;
        SEARCH: string;
        SEND: string;
        USERS: string;
        V2: string;
        VERIFICATION: string;
    };
    constructor(client: HttpClient, backendFeatures: BackendFeatures);
    /**
     * Clear all properties.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/clearProperties
     */
    deleteProperties(): Promise<void>;
    /**
     * Delete a property.
     * @param propertyKey The property key to delete
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/deleteProperty
     */
    deleteProperty(propertyKey: string): Promise<void>;
    /**
     * Activate (i.e. confirm) an email address or phone number.
     * @param activationCode Activation code
     * @param activationKey Activation key
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/activate
     */
    getActivation(activationCode: string, activationKey: string): Promise<ActivationResponse>;
    /**
     * Retrieve TURN server addresses and credentials.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getCallsConfig
     */
    getCallsConfiguration(): Promise<RTCConfiguration>;
    /**
     * Get a specific client of a user.
     * @param userId The user ID
     * @param clientId The client ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getUserClient
     */
    getClient(userId: string | QualifiedId, clientId: string): Promise<PublicClient>;
    /**
     * Get a prekey for a specific client of a user.
     * @param userId The user ID
     * @param clientId The client ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getPrekey
     */
    getClientPreKey(userId: string | QualifiedId, clientId: string): Promise<ClientPreKey>;
    private getClientPreKey_v1;
    private getClientPreKey_v2;
    /**
     * Get all of a user's clients.
     * @param userId The user ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getUserClients
     */
    getClients(userId: string | QualifiedId): Promise<PublicClient[]>;
    /**
     * Get information on a user handle.
     * @param handle The user's handle
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getUserHandleInfo
     */
    getHandle(handle: string): Promise<HandleInfo>;
    /**
     * List all property keys.
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/listPropertyKeys
     */
    getProperties(): Promise<string[]>;
    /**
     * Get a property value.
     * @param propertyKey The property key to get
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getProperty
     */
    getProperty<T>(propertyKey: string): Promise<T>;
    /**
     * Search for users.
     * @param query The search query
     * @param domain The domain where the user should be hosted
     * @param limit Number of results to return
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/search
     */
    getSearchContacts(query: string, limit?: number, domain?: string): Promise<RequestCancelable<SearchResult>>;
    /**
     * Get a user by ID.
     * @note If you want to get all properties (`sso_id`, `managed_by`, etc.) for your own user, use "/self".
     *       Otherwise you will get a user payload with a limited set of properties (what's publicly available).
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/user
     */
    getUser(userId: string | QualifiedId): Promise<User>;
    getUserPreKeys(userId: string | QualifiedId): Promise<PreKeyBundle>;
    /**
     * List users.
     * Note: The 'ids' and 'handles' parameters are mutually exclusive.
     * @param parameters Multiple user's handles or IDs
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/users
     */
    getUsers(parameters: {
        ids: string[];
    } | {
        handles: string[];
    }, limit?: number): Promise<User[]>;
    /**
     * List users.
     * @param userIds Multiple user's IDs
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/users
     */
    getUsersByIds(userIds: string[]): Promise<User[]>;
    /**
     * Check if a user ID exists.
     */
    headUsers(userId: string | QualifiedId): Promise<void>;
    /**
     * Activate (i.e. confirm) an email address or phone number.
     * Note: Activation only succeeds once and the number of failed attempts for a valid key is limited.
     * @param activationData Data to activate an account
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/activate_0
     */
    postActivation(activationData: Activate): Promise<ActivationResponse>;
    /**
     * Send (or resend) an email or phone activation code.
     * @param activationCodeData Data to send an activation code
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/sendActivationCode
     */
    postActivationCode(activationCodeData: SendActivationCode): Promise<void>;
    /**
     * Generates a verification code to be sent to the email address provided
     * @param email users email address
     * @param action whether the action is for a SCIM code generation or a user login
     */
    postVerificationCode(email: string, action: VerificationActionType): Promise<void>;
    /**
     * Verify account deletion with a code.
     * @param verificationData Data to verify the account deletion
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/verifyDeleteUser
     */
    postDelete(verificationData: VerifyDelete): Promise<void>;
    /**
     * Check availability of user handles.
     * @param handles The handles to check
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/checkUserHandles
     */
    postHandles(handles: CheckHandles): Promise<string[]>;
    /**
     * Check availability of a single user handle.
     * @param handle The handle to check
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/checkUserHandle
     */
    headHandle(handle: string): Promise<void>;
    /**
     * Get a user by fully qualified handle.
     * @param handle The handle of a user to search for
     */
    getUserByHandle(handle: QualifiedHandle): Promise<User>;
    private postMultiPreKeyBundlesChunk;
    private postMultiQualifiedPreKeyBundlesChunk;
    /**
     * List users.
     * Note: The 'qualified_ids' and 'qualified_handles' parameters are mutually exclusive.
     */
    postListUsers(users: {
        qualified_ids: QualifiedId[];
    } | {
        qualified_handles: QualifiedHandle[];
    }): Promise<User[]>;
    /**
     * Get client infos from a list of users.
     */
    postListClients(userIdList: LimitedQualifiedUserIdList): Promise<QualifiedPublicClients>;
    /**
     * Given a map of user IDs to client IDs return a prekey for each one.
     * @param userClientMap A map of the user's clients
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getMultiPrekeyBundles
     */
    postMultiPreKeyBundles(userClientMap: UserClients, limit?: number): Promise<UserPreKeyBundleMap>;
    /**
     * Given a map of qualified user IDs to client IDs return a prekey for each one.
     * @param userClientMap A map of the qualified user's clients
     */
    postQualifiedMultiPreKeyBundles(userClientMap: QualifiedUserClients, limit?: number): Promise<QualifiedUserPreKeyBundleMap>;
    /**
     * Initiate or complete a password reset.
     * @param resetData The data needed to initiate or complete the reset
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/beginPasswordReset
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/completePasswordReset
     */
    postPasswordReset(resetData: NewPasswordReset | CompletePasswordReset): Promise<void>;
    /**
     * Set a user property.
     * @param propertyKey The property key to set
     * @param propertyData The property data to set
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/setProperty
     */
    putProperty<T>(propertyKey: string, propertyData: T): Promise<void>;
    /**
     * Get rich info of a user
     * @param userId The user ID
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/getRichInfo
     */
    getRichInfo(userId: string): Promise<RichInfo>;
    /**
     * Resend email address validation
     * @param userId The user ID
     * @see https://staging-nginz-https.zinfra.io/api/swagger-ui/#/default/put_users__uid__email
     */
    putRevalidateEmail(userId: string, email: string): Promise<void>;
}
