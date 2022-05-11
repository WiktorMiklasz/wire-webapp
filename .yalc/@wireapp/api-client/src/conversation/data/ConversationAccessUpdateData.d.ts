import type { ACCESS_ROLE_V2, CONVERSATION_ACCESS, CONVERSATION_ACCESS_ROLE } from '../Conversation';
/**@deprecated */
export interface ConversationAccessUpdateData {
    access: CONVERSATION_ACCESS[];
    access_role: CONVERSATION_ACCESS_ROLE;
}
export interface ConversationAccessV2UpdateData {
    access: CONVERSATION_ACCESS[];
    access_role_v2: ACCESS_ROLE_V2[];
}
