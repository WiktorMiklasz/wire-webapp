"use strict";
/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetAPI = void 0;
const axios_1 = __importDefault(require("axios"));
const AssetRetentionPolicy_1 = require("./AssetRetentionPolicy");
const buffer_1 = require("../shims/node/buffer");
const http_1 = require("../http/");
const AssetUtil_1 = require("./AssetUtil");
const user_1 = require("../user");
const random_1 = require("../shims/node/random");
class AssetAPI {
    constructor(client) {
        this.client = client;
    }
    getAssetShared(assetUrl, token, forceCaching = false, progressCallback) {
        if (token && !(0, AssetUtil_1.isValidToken)(token)) {
            throw new TypeError(`Expected token "${token.substr(0, 5)}..." (redacted) to be base64 encoded string.`);
        }
        const cancelSource = axios_1.default.CancelToken.source();
        const config = {
            cancelToken: cancelSource.token,
            method: 'get',
            onDownloadProgress: (0, http_1.handleProgressEvent)(progressCallback),
            onUploadProgress: (0, http_1.handleProgressEvent)(progressCallback),
            params: {},
            responseType: 'arraybuffer',
            url: assetUrl,
        };
        if (token) {
            config.params.asset_token = token;
        }
        if (forceCaching) {
            config.params.forceCaching = forceCaching;
        }
        const handleRequest = async () => {
            try {
                const response = await this.client.sendRequest(config, true);
                return {
                    buffer: response.data,
                    mimeType: response.headers['content-type'],
                };
            }
            catch (error) {
                if (error.message === http_1.SyntheticErrorLabel.REQUEST_CANCELLED) {
                    throw new user_1.RequestCancellationError('Asset download got cancelled.');
                }
                throw error;
            }
        };
        return {
            cancel: () => cancelSource.cancel(http_1.SyntheticErrorLabel.REQUEST_CANCELLED),
            response: handleRequest(),
        };
    }
    postAssetShared(assetBaseUrl, asset, options, progressCallback) {
        var _a;
        const BOUNDARY = `Frontier${(0, random_1.unsafeAlphanumeric)()}`;
        const metadata = JSON.stringify({
            public: (_a = options === null || options === void 0 ? void 0 : options.public) !== null && _a !== void 0 ? _a : true,
            retention: (options === null || options === void 0 ? void 0 : options.retention) || AssetRetentionPolicy_1.AssetRetentionPolicy.PERSISTENT,
            domain: options === null || options === void 0 ? void 0 : options.domain,
        });
        const body = `--${BOUNDARY}\r\n` +
            'Content-Type: application/json;charset=utf-8\r\n' +
            `Content-length: ${metadata.length}\r\n` +
            '\r\n' +
            `${metadata}\r\n` +
            `--${BOUNDARY}\r\n` +
            'Content-Type: application/octet-stream\r\n' +
            `Content-length: ${asset.length}\r\n` +
            `Content-MD5: ${(0, buffer_1.base64MD5FromBuffer)(asset.buffer)}\r\n` +
            '\r\n';
        const footer = `\r\n--${BOUNDARY}--\r\n`;
        const cancelSource = axios_1.default.CancelToken.source();
        const config = {
            cancelToken: cancelSource.token,
            data: (0, buffer_1.concatToBuffer)(body, asset, footer),
            headers: {
                'Content-Type': `multipart/mixed; boundary=${BOUNDARY}`,
            },
            method: 'post',
            onDownloadProgress: (0, http_1.handleProgressEvent)(progressCallback),
            onUploadProgress: (0, http_1.handleProgressEvent)(progressCallback),
            url: assetBaseUrl,
        };
        const handleRequest = async () => {
            try {
                const response = await this.client.sendRequest(config);
                return response.data;
            }
            catch (error) {
                if (error.message === http_1.SyntheticErrorLabel.REQUEST_CANCELLED) {
                    throw new user_1.RequestCancellationError('Asset upload got cancelled.');
                }
                throw error;
            }
        };
        return {
            cancel: () => cancelSource.cancel(http_1.SyntheticErrorLabel.REQUEST_CANCELLED),
            response: handleRequest(),
        };
    }
    getAssetV1(assetId, conversationId, forceCaching = false, progressCallback) {
        if (!(0, AssetUtil_1.isValidUUID)(assetId)) {
            throw new TypeError(`Expected asset ID "${assetId}" to only contain alphanumeric values and dashes.`);
        }
        if (!(0, AssetUtil_1.isValidUUID)(conversationId)) {
            throw new TypeError(`Expected conversation ID "${conversationId}" to only contain alphanumeric values and dashes.`);
        }
        const cancelSource = axios_1.default.CancelToken.source();
        const config = {
            cancelToken: cancelSource.token,
            method: 'get',
            onDownloadProgress: (0, http_1.handleProgressEvent)(progressCallback),
            onUploadProgress: (0, http_1.handleProgressEvent)(progressCallback),
            params: {
                conv_id: conversationId,
            },
            responseType: 'arraybuffer',
            url: `${AssetAPI.ASSET_V1_URL}/${assetId}`,
        };
        if (forceCaching) {
            config.params.forceCaching = forceCaching;
        }
        const handleRequest = async () => {
            try {
                const response = await this.client.sendRequest(config, true);
                return {
                    buffer: response.data,
                    mimeType: response.headers['content-type'],
                };
            }
            catch (error) {
                if (error.message === http_1.SyntheticErrorLabel.REQUEST_CANCELLED) {
                    throw new user_1.RequestCancellationError('Asset download got cancelled.');
                }
                throw error;
            }
        };
        return {
            cancel: () => cancelSource.cancel(http_1.SyntheticErrorLabel.REQUEST_CANCELLED),
            response: handleRequest(),
        };
    }
    getAssetV2(assetId, conversationId, forceCaching = false, progressCallback) {
        if (!(0, AssetUtil_1.isValidUUID)(assetId)) {
            throw new TypeError(`Expected asset ID "${assetId}" to only contain alphanumeric values and dashes.`);
        }
        if (!(0, AssetUtil_1.isValidUUID)(conversationId)) {
            throw new TypeError(`Expected conversation ID "${conversationId}" to only contain alphanumeric values and dashes.`);
        }
        const cancelSource = axios_1.default.CancelToken.source();
        const config = {
            cancelToken: cancelSource.token,
            method: 'get',
            onDownloadProgress: (0, http_1.handleProgressEvent)(progressCallback),
            onUploadProgress: (0, http_1.handleProgressEvent)(progressCallback),
            params: {},
            responseType: 'arraybuffer',
            url: `${AssetAPI.ASSET_V2_CONVERSATION_URL}/${conversationId}${AssetAPI.ASSET_V2_URL}/${assetId}`,
        };
        if (forceCaching) {
            config.params.forceCaching = forceCaching;
        }
        const handleRequest = async () => {
            try {
                const response = await this.client.sendRequest(config, true);
                return {
                    buffer: response.data,
                    mimeType: response.headers['content-type'],
                };
            }
            catch (error) {
                if (error.message === http_1.SyntheticErrorLabel.REQUEST_CANCELLED) {
                    throw new user_1.RequestCancellationError('Asset download got cancelled.');
                }
                throw error;
            }
        };
        return {
            cancel: () => cancelSource.cancel(http_1.SyntheticErrorLabel.REQUEST_CANCELLED),
            response: handleRequest(),
        };
    }
    getAssetV3(assetId, token, forceCaching = false, progressCallback) {
        if (!(0, AssetUtil_1.isValidUUID)(assetId)) {
            throw new TypeError(`Expected asset ID "${assetId}" to only contain alphanumeric values and dashes.`);
        }
        const assetBaseUrl = `${AssetAPI.ASSET_V3_URL}/${assetId}`;
        return this.getAssetShared(assetBaseUrl, token, forceCaching, progressCallback);
    }
    getAssetV4(assetId, assetDomain, token, forceCaching = false, progressCallback) {
        if (!(0, AssetUtil_1.isValidUUID)(assetId)) {
            throw new TypeError(`Expected asset ID "${assetId}" to only contain alphanumeric values and dashes.`);
        }
        const assetBaseUrl = `${AssetAPI.ASSET_V4_URL}/${assetDomain}/${assetId}`;
        return this.getAssetShared(assetBaseUrl, token, forceCaching, progressCallback);
    }
    getServiceAsset(assetId, token, forceCaching = false, progressCallback) {
        if (!(0, AssetUtil_1.isValidUUID)(assetId)) {
            throw new TypeError(`Expected asset ID "${assetId}" to only contain alphanumeric values and dashes.`);
        }
        const assetBaseUrl = `${AssetAPI.ASSET_SERVICE_URL}/${assetId}`;
        return this.getAssetShared(assetBaseUrl, token, forceCaching, progressCallback);
    }
    /**
     * Uploads an asset to the backend
     *
     * @param asset Raw content of the asset to upload
     * @param options?
     * @param progressCallback? Will be called at every progress of the upload
     */
    postAsset(asset, options, progressCallback) {
        return this.postAssetShared(AssetAPI.ASSET_V3_URL, asset, options, progressCallback);
    }
    postServiceAsset(asset, options, progressCallback) {
        const assetBaseUrl = AssetAPI.ASSET_SERVICE_URL;
        return this.postAssetShared(assetBaseUrl, asset, options, progressCallback);
    }
}
exports.AssetAPI = AssetAPI;
AssetAPI.ASSET_V3_URL = '/assets/v3';
AssetAPI.ASSET_V4_URL = '/assets/v4';
AssetAPI.ASSET_SERVICE_URL = '/bot/assets';
AssetAPI.ASSET_V2_URL = '/otr/assets';
AssetAPI.ASSET_V2_CONVERSATION_URL = '/conversations';
AssetAPI.ASSET_V1_URL = '/assets';
//# sourceMappingURL=AssetAPI.js.map