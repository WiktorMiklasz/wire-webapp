/// <reference types="node" />
import { AssetRetentionPolicy } from './AssetRetentionPolicy';
import { HttpClient, ProgressCallback, RequestCancelable } from '../http/';
import type { AssetUploadData } from './AssetUploadData';
export interface CipherOptions {
    /** Set a custom algorithm for encryption */
    algorithm?: string;
    /** Set a custom hash for encryption */
    hash?: Buffer;
}
export interface AssetOptions extends CipherOptions {
    public?: boolean;
    retention?: AssetRetentionPolicy;
    /** If given, will upload an asset that can be shared in a federated env */
    domain?: string;
}
export interface AssetResponse {
    buffer: ArrayBuffer;
    mimeType: string;
}
export declare class AssetAPI {
    private readonly client;
    private static readonly ASSET_V3_URL;
    private static readonly ASSET_V4_URL;
    private static readonly ASSET_SERVICE_URL;
    private static readonly ASSET_V2_URL;
    private static readonly ASSET_V2_CONVERSATION_URL;
    private static readonly ASSET_V1_URL;
    constructor(client: HttpClient);
    private getAssetShared;
    private postAssetShared;
    getAssetV1(assetId: string, conversationId: string, forceCaching?: boolean, progressCallback?: ProgressCallback): {
        cancel: () => void;
        response: Promise<AssetResponse>;
    };
    getAssetV2(assetId: string, conversationId: string, forceCaching?: boolean, progressCallback?: ProgressCallback): {
        cancel: () => void;
        response: Promise<AssetResponse>;
    };
    getAssetV3(assetId: string, token?: string | null, forceCaching?: boolean, progressCallback?: ProgressCallback): RequestCancelable<AssetResponse>;
    getAssetV4(assetId: string, assetDomain: string, token?: string | null, forceCaching?: boolean, progressCallback?: ProgressCallback): RequestCancelable<AssetResponse>;
    getServiceAsset(assetId: string, token?: string | null, forceCaching?: boolean, progressCallback?: ProgressCallback): RequestCancelable<AssetResponse>;
    /**
     * Uploads an asset to the backend
     *
     * @param asset Raw content of the asset to upload
     * @param options?
     * @param progressCallback? Will be called at every progress of the upload
     */
    postAsset(asset: Uint8Array, options?: AssetOptions, progressCallback?: ProgressCallback): RequestCancelable<AssetUploadData>;
    postServiceAsset(asset: Uint8Array, options?: AssetOptions, progressCallback?: ProgressCallback): RequestCancelable<AssetUploadData>;
}
