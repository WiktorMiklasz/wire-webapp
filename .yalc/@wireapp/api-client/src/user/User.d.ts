import type { AccentColor } from '@wireapp/commons';
import type { ServiceRef } from '../conversation/';
import type { Picture } from '../self/';
import type { UserAsset } from '../user/';
import type { QualifiedId } from './QualifiedId';
export interface User {
    accent_id?: AccentColor.AccentColorID;
    assets?: UserAsset[];
    deleted?: boolean;
    email?: string;
    email_unvalidated?: string;
    expires_at?: string;
    handle?: string;
    id: string;
    name: string;
    picture?: Picture[];
    qualified_id?: QualifiedId;
    service?: ServiceRef;
    team?: string;
}
