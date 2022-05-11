import type { ConnectionStatus } from '../connection/';
import { QualifiedId } from '../user';
export interface Connection {
    conversation: string;
    qualified_conversation?: QualifiedId;
    from: string;
    last_update: string;
    message?: string;
    status: ConnectionStatus;
    to: string;
    qualified_to?: QualifiedId;
}
