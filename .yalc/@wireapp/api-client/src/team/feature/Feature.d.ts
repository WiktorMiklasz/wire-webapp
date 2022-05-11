export declare enum FeatureStatus {
    DISABLED = "disabled",
    ENABLED = "enabled"
}
export declare enum FeatureLockStatus {
    LOCKED = "locked",
    UNLOCKED = "unlocked"
}
export interface FeatureWithoutConfig {
    status: FeatureStatus;
    lockStatus?: FeatureLockStatus;
}
export interface Feature<T extends FeatureConfig> extends FeatureWithoutConfig {
    config: T;
}
export interface FeatureConfig {
}
export interface FeatureAppLockConfig extends FeatureConfig {
    enforceAppLock: boolean;
    inactivityTimeoutSecs: number;
}
export declare enum SelfDeletingTimeout {
    OFF = 0,
    SECONDS_10 = 10,
    MINUTES_5 = 300,
    HOURS_1 = 3600,
    DAYS_1 = 86400,
    WEEKS_1 = 604800,
    WEEKS_4 = 2419200
}
export interface FeatureSelfDeletingMessagesConfig extends FeatureConfig {
    enforcedTimeoutSeconds: SelfDeletingTimeout | number;
}
export interface FeatureClassifiedDomainsConfig extends FeatureConfig {
    domains: string[];
}
export declare type FeatureAppLock = Feature<FeatureAppLockConfig>;
export declare type FeatureClassifiedDomains = Feature<FeatureClassifiedDomainsConfig>;
export declare type FeatureConferenceCalling = FeatureWithoutConfig;
export declare type FeatureDigitalSignature = FeatureWithoutConfig;
export declare type FeatureConversationGuestLink = FeatureWithoutConfig;
export declare type FeatureFileSharing = FeatureWithoutConfig;
export declare type FeatureLegalhold = FeatureWithoutConfig;
export declare type FeatureSearchVisibility = FeatureWithoutConfig;
export declare type FeatureSelfDeletingMessages = Feature<FeatureSelfDeletingMessagesConfig>;
export declare type FeatureSSO = FeatureWithoutConfig;
export declare type FeatureSndFactorPassword = FeatureWithoutConfig;
export declare type FeatureValidateSAMLEmails = FeatureWithoutConfig;
export declare type FeatureVideoCalling = FeatureWithoutConfig;
