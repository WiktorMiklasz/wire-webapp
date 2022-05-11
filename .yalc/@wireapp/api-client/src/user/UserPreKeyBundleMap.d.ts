import type { PreKey } from '../auth';
export interface UserPreKeyBundleMap {
    [userId: string]: {
        [clientId: string]: PreKey | null;
    };
}
export interface QualifiedUserPreKeyBundleMap {
    [domain: string]: UserPreKeyBundleMap;
}
