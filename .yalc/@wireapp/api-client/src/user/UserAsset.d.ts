export declare enum UserAssetType {
    COMPLETE = "complete",
    PREVIEW = "preview"
}
export interface UserAsset {
    key: string;
    domain?: string;
    size: UserAssetType;
    type: 'image';
}
