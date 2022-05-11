import type { PreKey } from '../../auth';
export interface UserLegalHoldRequestData {
    client: {
        id: string;
    };
    /** The ID of the user that is targeted (formally `target_user`) */
    id: string;
    last_prekey: PreKey;
}
