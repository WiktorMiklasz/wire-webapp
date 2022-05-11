"use strict";
/*
 * Wire
 * Copyright (C) 2020 Wire Swiss GmbH
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureLockedError = exports.InvalidAppLockTimeoutError = exports.FeatureError = void 0;
const http_1 = require("../../http");
class FeatureError extends http_1.BackendError {
    constructor(message, label, code) {
        super(message, label, code);
        Object.setPrototypeOf(this, FeatureError.prototype);
        this.name = 'FeatureError';
    }
}
exports.FeatureError = FeatureError;
class InvalidAppLockTimeoutError extends FeatureError {
    constructor(message, label = http_1.BackendErrorLabel.APP_LOCK_INVALID_TIMEOUT, code = http_1.StatusCode.BAD_REQUEST) {
        super(message, label, code);
        Object.setPrototypeOf(this, InvalidAppLockTimeoutError.prototype);
        this.name = 'InvalidAppLockTimeoutError';
    }
}
exports.InvalidAppLockTimeoutError = InvalidAppLockTimeoutError;
class FeatureLockedError extends FeatureError {
    constructor(message, label = http_1.BackendErrorLabel.FEATURE_LOCKED, code = http_1.StatusCode.CONFLICT) {
        super(message, label, code);
        Object.setPrototypeOf(this, FeatureLockedError.prototype);
        this.name = 'FeatureLockedError';
    }
}
exports.FeatureLockedError = FeatureLockedError;
//# sourceMappingURL=FeatureError.js.map