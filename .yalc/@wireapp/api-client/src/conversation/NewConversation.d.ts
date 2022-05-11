import type { TeamInfo } from '../team/';
import type { QualifiedId } from '../user/';
import type { Conversation } from './Conversation';
import type { DefaultConversationRoleName } from './ConversationRole';
import type { RECEIPT_MODE } from './data/ConversationReceiptModeUpdateData';
export interface NewConversation extends Partial<Pick<Conversation, 'access' | 'access_role' | 'access_role_v2' | 'message_timer' | 'name'>> {
    conversation_role?: DefaultConversationRoleName;
    qualified_users?: QualifiedId[];
    receipt_mode: RECEIPT_MODE | null;
    team?: TeamInfo;
    users: string[];
}
