import type { PreKey } from '../auth/';
import type { ClientClassification, ClientType, Location } from './';
import { ClientCapabilityData } from './ClientCapabilityData';
declare type BaseUpdatePayload = ClientCapabilityData & {
    label?: string;
};
declare type MLSUpdatePayload = {
    mls_public_keys: {
        ed25519: string[];
    };
} & BaseUpdatePayload;
declare type ProteusUpdatePayload = {
    label?: string;
    lastkey: PreKey;
    prekeys: PreKey[];
} & BaseUpdatePayload;
export declare type UpdateClientPayload = Partial<ProteusUpdatePayload | MLSUpdatePayload>;
export declare type CreateClientPayload = {
    class: ClientClassification.DESKTOP | ClientClassification.PHONE | ClientClassification.TABLET;
    cookie: string;
    label?: string;
    lastkey: PreKey;
    prekeys: PreKey[];
    location?: Location;
    model?: string;
    password?: string;
    verification_code?: string;
    type: ClientType.PERMANENT | ClientType.TEMPORARY;
};
export {};
