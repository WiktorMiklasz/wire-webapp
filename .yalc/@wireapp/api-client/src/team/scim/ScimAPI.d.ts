import type { HttpClient } from '../../http';
import { NewScimToken } from './NewScimToken';
import { ScimTokenInfoList } from './ScimTokenInfoList';
export declare class ScimAPI {
    private readonly client;
    constructor(client: HttpClient);
    static readonly URL: {
        AUTH_TOKENS: string;
        SCIM: string;
    };
    getTokens(): Promise<ScimTokenInfoList>;
    deleteToken(scimTokenId: string): Promise<void>;
    postToken(description: string, password?: string, verificationCode?: string): Promise<NewScimToken>;
}
