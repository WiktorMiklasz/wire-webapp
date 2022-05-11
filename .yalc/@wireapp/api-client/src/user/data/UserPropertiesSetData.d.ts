export declare enum AudioPreference {
    ALL = "all",
    NONE = "none",
    SOME = "some"
}
export declare enum NotificationPreference {
    NONE = "none",
    OBFUSCATE = "obfuscate",
    OBFUSCATE_MESSAGE = "obfuscate-message",
    ON = "on"
}
export interface WebappProperties {
    [property_key: string]: any;
    enable_debugging: boolean;
    settings: {
        call: {
            enable_vbr_encoding: boolean;
            enable_soundless_incoming_calls: boolean;
        };
        emoji: {
            replace_inline: boolean;
        };
        interface: {
            theme: 'dark' | 'default';
            view_folders: boolean;
        };
        notifications: NotificationPreference;
        previews: {
            send: boolean;
        };
        privacy: {
            improve_wire?: boolean;
            report_errors?: boolean;
            telemetry_sharing?: boolean;
        };
        sound: {
            alerts: AudioPreference;
        };
    };
    version: number;
}
export interface UserPropertiesSetData {
    key: 'webapp';
    value: WebappProperties;
}
