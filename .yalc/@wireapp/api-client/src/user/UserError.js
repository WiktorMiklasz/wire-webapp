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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestCancellationError = exports.UnconnectedUserError = exports.UserIsUnknownError = exports.UserError = void 0;
const http_1 = require("../http/");
class UserError extends http_1.BackendError {
    constructor(message, label, code) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'UserError';
    }
}
exports.UserError = UserError;
class UserIsUnknownError extends UserError {
    constructor(message, label = http_1.BackendErrorLabel.CLIENT_ERROR, code = http_1.StatusCode.BAD_REQUEST) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'UserIsUnknownError';
    }
}
exports.UserIsUnknownError = UserIsUnknownError;
class UnconnectedUserError extends UserError {
    constructor(message, label = http_1.BackendErrorLabel.NOT_CONNECTED, code = http_1.StatusCode.FORBIDDEN) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'UnconnectedUserError';
    }
}
exports.UnconnectedUserError = UnconnectedUserError;
class RequestCancellationError extends UserError {
    constructor(message, label = http_1.SyntheticErrorLabel.REQUEST_CANCELLED, code) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'RequestCancellationError';
    }
}
exports.RequestCancellationError = RequestCancellationError;
//# sourceMappingURL=UserError.js.map