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
exports.InvitationMultipleError = exports.InvitationNotFoundError = exports.InvitationPhoneExistsError = exports.InvitationEmailExistsError = exports.InvitationInvalidPhoneError = exports.InvitationInvalidEmailError = exports.InvitationError = void 0;
const http_1 = require("../../http");
class InvitationError extends http_1.BackendError {
    constructor(message, label, code) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'InvitationError';
    }
}
exports.InvitationError = InvitationError;
class InvitationInvalidEmailError extends InvitationError {
    constructor(message, label = http_1.BackendErrorLabel.INVALID_EMAIL, code = http_1.StatusCode.BAD_REQUEST) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'InvitationInvalidEmailError';
    }
}
exports.InvitationInvalidEmailError = InvitationInvalidEmailError;
class InvitationInvalidPhoneError extends InvitationError {
    constructor(message, label = http_1.BackendErrorLabel.INVALID_PHONE, code = http_1.StatusCode.BAD_REQUEST) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'InvitationInvalidPhoneError';
    }
}
exports.InvitationInvalidPhoneError = InvitationInvalidPhoneError;
class InvitationEmailExistsError extends InvitationError {
    constructor(message, label = http_1.BackendErrorLabel.INVITE_EMAIL_EXISTS, code = http_1.StatusCode.BAD_REQUEST) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'InvitationEmailExistsError';
    }
}
exports.InvitationEmailExistsError = InvitationEmailExistsError;
class InvitationPhoneExistsError extends InvitationError {
    constructor(message, label = http_1.BackendErrorLabel.PHONE_EXISTS, code = http_1.StatusCode.CONFLICT) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'InvitationPhoneExistsError';
    }
}
exports.InvitationPhoneExistsError = InvitationPhoneExistsError;
class InvitationNotFoundError extends InvitationError {
    constructor(message, label = http_1.SyntheticErrorLabel.INVITATION_NOT_FOUND, code = http_1.StatusCode.NOT_FOUND) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'InvitationNotFoundError';
    }
}
exports.InvitationNotFoundError = InvitationNotFoundError;
class InvitationMultipleError extends InvitationError {
    constructor(message, label = http_1.SyntheticErrorLabel.INVITATION_MULTIPLE_FOUND, code = http_1.StatusCode.CONFLICT) {
        super(message, label, code);
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = 'InvitationMultipleError';
    }
}
exports.InvitationMultipleError = InvitationMultipleError;
//# sourceMappingURL=InvitationError.js.map