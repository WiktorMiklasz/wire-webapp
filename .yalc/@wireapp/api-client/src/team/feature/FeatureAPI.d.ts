import { HttpClient } from '../../http';
import type { FeatureAppLock, FeatureVideoCalling, FeatureConferenceCalling, FeatureDigitalSignature, FeatureLegalhold, FeatureSSO, FeatureFileSharing, FeatureSelfDeletingMessages, FeatureSndFactorPassword } from './Feature';
import type { FeatureList } from './FeatureList';
import { FeatureConversationGuestLink } from '.';
export declare class FeatureAPI {
    private readonly client;
    constructor(client: HttpClient);
    static readonly URL: {
        APPLOCK: string;
        CALLING_CONFERENCE: string;
        CALLING_VIDEO: string;
        SELF_DELETING_MESSAGES: string;
        DIGITAL_SIGNATURES: string;
        CONVERSATION_GUEST_LINKS: string;
        FEATURE_CONFIGS: string;
        FEATURES: string;
        FILE_SHARING: string;
        LEGAL_HOLD: string;
        SND_FACTOR_PASSWORD: string;
        SSO: string;
        TEAMS: string;
    };
    getAllFeatures(): Promise<FeatureList>;
    /**
     * @deprecated Use `getAllFeatures()` instead.
     */
    getAllTeamFeatures(teamId: string): Promise<FeatureList>;
    getLegalholdFeature(): Promise<FeatureLegalhold>;
    getConversationGuestLinkFeature(): Promise<FeatureConversationGuestLink>;
    putConversationGuestLinkFeature(teamId: string, conversationGuestLinkFeature: Omit<FeatureConversationGuestLink, 'lockStatus'>): Promise<FeatureConversationGuestLink>;
    getConferenceCallingFeature(): Promise<FeatureConferenceCalling>;
    putConferenceCallingFeature(teamId: string, conferenceCallingFeature: Omit<FeatureConferenceCalling, 'lockStatus'>): Promise<FeatureConferenceCalling>;
    getVideoCallingFeature(): Promise<FeatureVideoCalling>;
    putVideoCallingFeature(teamId: string, videoCallingFeature: Omit<FeatureVideoCalling, 'lockStatus'>): Promise<FeatureVideoCalling>;
    getSelfDeletingMessagesFeature(): Promise<FeatureSelfDeletingMessages>;
    putSelfDeletingMessagesFeature(teamId: string, selfDeleteingMessagesFeature: Omit<FeatureSelfDeletingMessages, 'lockStatus'>): Promise<FeatureSelfDeletingMessages>;
    getFileSharingFeature(): Promise<FeatureFileSharing>;
    putFileSharingFeature(teamId: string, fileSharingFeature: Omit<FeatureFileSharing, 'lockStatus'>): Promise<FeatureFileSharing>;
    getSndFactorPasswordFeature(): Promise<FeatureSndFactorPassword>;
    getSSOFeature(): Promise<FeatureSSO>;
    getDigitalSignatureFeature(teamId: string): Promise<FeatureDigitalSignature>;
    getAppLockFeature(): Promise<FeatureAppLock>;
    putAppLockFeature(teamId: string, appLockFeature: Omit<FeatureAppLock, 'lockStatus'>): Promise<FeatureAppLock>;
}
