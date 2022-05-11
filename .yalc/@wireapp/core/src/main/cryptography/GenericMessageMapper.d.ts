import type { ConversationOtrMessageAddEvent } from '@wireapp/api-client/src/event/';
import { PayloadBundle, PayloadBundleSource } from '../conversation';
export declare class GenericMessageMapper {
    private static readonly logger;
    static mapGenericMessage(genericMessage: any, event: ConversationOtrMessageAddEvent, source: PayloadBundleSource): PayloadBundle;
}
