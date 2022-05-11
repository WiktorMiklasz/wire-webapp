import type { ClientType, Location, PublicClient } from './';
export interface AddedClient extends PublicClient {
    /** The IP address from which the client was registered */
    address?: string;
    label?: string;
    location?: Location;
    model?: string;
    /** An ISO 8601 Date string */
    time: string;
    type: ClientType.PERMANENT | ClientType.TEMPORARY;
}
export interface RegisteredClient extends AddedClient {
    /** The cookie label */
    cookie: string;
}
