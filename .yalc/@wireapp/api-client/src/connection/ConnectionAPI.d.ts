import { BackendFeatures } from '../APIClient';
import type { Connection, ConnectionUpdate, UserConnectionList } from '../connection/';
import { HttpClient } from '../http/';
import { QualifiedId } from '../user';
export declare class ConnectionAPI {
    private readonly client;
    private readonly backendFeatures;
    constructor(client: HttpClient, backendFeatures: BackendFeatures);
    static readonly URL: {
        CONNECTIONS: string;
    };
    /**
     * Get an existing connection to another user.
     * @param userId The ID of the other user
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/connection
     */
    getConnection(userId: string | QualifiedId): Promise<Connection>;
    /**
     * List the connections to other users.
     * @param limit Number of results to return (default 100, max 500)
     * @param connectionId The connection ID to start from
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/connections
     */
    getConnections(connectionId?: string, limit?: number): Promise<UserConnectionList>;
    /**
     * Get the list of all the connections to other users (including users that are on federated servers)
     *
     * @see https://nginz-https.anta.wire.link/api/swagger-ui/#/default/post_list_connections
     */
    getConnectionList(): Promise<Connection[]>;
    /**
     * Get all connections to other users.
     * @deprecated use `getConnectionList` instead
     */
    getAllConnections(): Promise<Connection[]>;
    postConnection(userId: QualifiedId, name?: string): Promise<Connection>;
    /**
     * Create a connection to another user.
     * Note: You can have no more than 1000 connections in accepted or sent state.
     * @deprecated use createConnection instead
     * @param connectionRequestData: The connection request
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/createConnection
     */
    private postConnection_v1;
    /**
     * Create a connection to another user.
     * Note: You can have no more than 1000 connections in accepted or sent state.
     * @param qualifiedUserId: The qualified id of the user we want to connect to
     * @see https://nginz-https.anta.wire.link/api/swagger-ui/#/default/post_connections__uid_domain___uid
     */
    private postConnection_v2;
    /**
     * Update a connection.
     * Note: You can have no more than 1000 connections in accepted or sent state.
     * @param userId The ID of the other user (qualified or not)
     * @param updatedConnection: The updated connection
     * @see https://staging-nginz-https.zinfra.io/swagger-ui/#!/users/updateConnection
     */
    putConnection(userId: string | QualifiedId, updatedConnection: ConnectionUpdate): Promise<Connection>;
}
