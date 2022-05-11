import { FeatureConversationGuestLink } from '.';
import type { FeatureAppLock, FeatureClassifiedDomains, FeatureConferenceCalling, FeatureDigitalSignature, FeatureFileSharing, FeatureLegalhold, FeatureSelfDeletingMessages, FeatureSndFactorPassword, FeatureVideoCalling, FeatureWithoutConfig } from './Feature';
export declare enum FEATURE_KEY {
    APPLOCK = "appLock",
    CLASSIFIED_DOMAINS = "classifiedDomains",
    CONFERENCE_CALLING = "conferenceCalling",
    DIGITAL_SIGNATURES = "digitalSignatures",
    CONVERSATION_GUEST_LINKS = "conversationGuestLinks",
    FILE_SHARING = "fileSharing",
    LEGALHOLD = "legalhold",
    SEARCH_VISIBILITY = "searchVisibility",
    SSO = "sso",
    VALIDATE_SAML_EMAILS = "validateSAMLemails",
    VIDEO_CALLING = "videoCalling",
    SELF_DELETING_MESSAGES = "selfDeletingMessages",
    SND_FACTOR_PASSWORD = "sndFactorPasswordChallenge"
}
export declare type FeatureList = {
    [FEATURE_KEY.APPLOCK]?: FeatureAppLock;
    [FEATURE_KEY.CLASSIFIED_DOMAINS]?: FeatureClassifiedDomains;
    [FEATURE_KEY.CONFERENCE_CALLING]?: FeatureConferenceCalling;
    [FEATURE_KEY.DIGITAL_SIGNATURES]?: FeatureDigitalSignature;
    [FEATURE_KEY.CONVERSATION_GUEST_LINKS]?: FeatureConversationGuestLink;
    [FEATURE_KEY.FILE_SHARING]?: FeatureFileSharing;
    [FEATURE_KEY.LEGALHOLD]?: FeatureLegalhold;
    [FEATURE_KEY.SEARCH_VISIBILITY]?: FeatureWithoutConfig;
    [FEATURE_KEY.SELF_DELETING_MESSAGES]?: FeatureSelfDeletingMessages;
    [FEATURE_KEY.SND_FACTOR_PASSWORD]?: FeatureSndFactorPassword;
    [FEATURE_KEY.SSO]?: FeatureWithoutConfig;
    [FEATURE_KEY.VALIDATE_SAML_EMAILS]?: FeatureWithoutConfig;
    [FEATURE_KEY.VIDEO_CALLING]?: FeatureVideoCalling;
};
