import type { HttpClient } from '../../http';
import type { IdentityProvider } from './IdentityProvider';
import type { IdentityProviders } from './IdentityProviders';
export declare class IdentityProviderAPI {
    private readonly client;
    constructor(client: HttpClient);
    static readonly URL: {
        METADATA: string;
        PROVIDER: string;
        SSO: string;
    };
    getIdentityProvider(identityProviderId: string): Promise<IdentityProvider>;
    getIdentityProviders(): Promise<IdentityProviders>;
    deleteIdentityProvider(identityProviderId: string, force?: boolean): Promise<void>;
    postIdentityProvider(identityData: string, replaceProviderId?: string): Promise<IdentityProvider>;
    putIdentityProvider(identityProviderId: string, identityData: string): Promise<IdentityProvider>;
    getMetadata(): Promise<string>;
}
