import type { ConversationMembers } from './';
import type { QualifiedId } from '../user';
import type { RECEIPT_MODE } from './data';
export declare enum CONVERSATION_TYPE {
    REGULAR = 0,
    SELF = 1,
    ONE_TO_ONE = 2,
    CONNECT = 3
}
export declare enum CONVERSATION_ACCESS_ROLE {
    ACTIVATED = "activated",
    NON_ACTIVATED = "non_activated",
    PRIVATE = "private",
    TEAM = "team"
}
export declare enum ACCESS_ROLE_V2 {
    TEAM_MEMBER = "team_member",
    SERVICE = "service",
    NON_TEAM_MEMBER = "non_team_member",
    GUEST = "guest"
}
export declare enum CONVERSATION_ACCESS {
    CODE = "code",
    INVITE = "invite",
    LINK = "link",
    PRIVATE = "private"
}
declare type UUID = string;
/**
 * A conversation object as returned from the server
 */
export interface Conversation {
    qualified_id: QualifiedId;
    /** @deprecated Use qualified_id instead */
    id: UUID;
    type: CONVERSATION_TYPE;
    creator: UUID;
    access: CONVERSATION_ACCESS[];
    /** How users can join conversations */
    /** @deprecated Use access_role_v2 instead */
    access_role: CONVERSATION_ACCESS_ROLE;
    access_role_v2: ACCESS_ROLE_V2[];
    name?: string;
    last_event?: string;
    last_event_time?: string;
    team?: UUID;
    /**
     * Per-conversation message timer (can be null)
     * @format int64
     * @min -9223372036854776000
     * @max 9223372036854776000
     */
    message_timer?: number;
    /**
     * Conversation receipt mode
     * @format int32
     * @min -2147483648
     * @max 2147483647
     */
    receipt_mode?: RECEIPT_MODE;
    /** Users of a conversation */
    members: ConversationMembers;
}
export {};
