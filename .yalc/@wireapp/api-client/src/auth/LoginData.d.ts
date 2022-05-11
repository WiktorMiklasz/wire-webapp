import type { ClientType } from '../client/';
export interface LoginData {
    clientType: ClientType;
    code?: string;
    email?: string;
    handle?: string;
    password?: number | string;
    phone?: string;
    verificationCode?: string;
}
