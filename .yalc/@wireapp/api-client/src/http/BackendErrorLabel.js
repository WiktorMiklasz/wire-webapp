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
exports.SyntheticErrorLabel = exports.BackendErrorLabel = void 0;
/**
 * @note Backend error labels are defined by the backend team and their source code.
 * @see https://github.com/wireapp/wire-server/blob/master/services/galley/src/Galley/API/Error.hs
 */
var BackendErrorLabel;
(function (BackendErrorLabel) {
    BackendErrorLabel["ACCESS_DENIED"] = "access-denied";
    BackendErrorLabel["BAD_REQUEST"] = "bad-request";
    BackendErrorLabel["BAD_GATEWAY"] = "bad-gateway";
    BackendErrorLabel["CLIENT_ERROR"] = "client-error";
    BackendErrorLabel["SERVER_ERROR"] = "server-error";
    BackendErrorLabel["INSUFFICIENT_PERMISSIONS"] = "insufficient-permissions";
    BackendErrorLabel["INTERNAL_ERROR"] = "internal-error";
    BackendErrorLabel["INVALID_OPERATION"] = "invalid-op";
    BackendErrorLabel["INVALID_PAYLOAD"] = "invalid-payload";
    BackendErrorLabel["INVALID_PERMISSIONS"] = "invalid-permissions";
    BackendErrorLabel["NOT_FOUND"] = "not-found";
    BackendErrorLabel["OPERATION_DENIED"] = "operation-denied";
    BackendErrorLabel["QUEUE_FULL"] = "queue-full";
    BackendErrorLabel["UNAUTHORIZED"] = "unauthorized";
    // Authentication errors
    BackendErrorLabel["BLACKLISTED_EMAIL"] = "blacklisted-email";
    BackendErrorLabel["BLACKLISTED_PHONE"] = "blacklisted-phone";
    BackendErrorLabel["DOMAIN_BLOCKED_FOR_REGISTRATION"] = "domain-blocked-for-registration";
    BackendErrorLabel["INVALID_CODE"] = "invalid-code";
    BackendErrorLabel["INVALID_CREDENTIALS"] = "invalid-credentials";
    BackendErrorLabel["INVALID_EMAIL"] = "invalid-email";
    BackendErrorLabel["INVALID_INVITATION_CODE"] = "invalid-invitation-code";
    BackendErrorLabel["INVALID_PHONE"] = "invalid-phone";
    BackendErrorLabel["PHONE_EXISTS"] = "phone-exists";
    BackendErrorLabel["KEY_EXISTS"] = "key-exists";
    BackendErrorLabel["MISSING_AUTH"] = "missing-auth";
    BackendErrorLabel["PASSWORD_EXISTS"] = "password-exists";
    BackendErrorLabel["PENDING_ACTIVATION"] = "pending-activation";
    BackendErrorLabel["PENDING_LOGIN"] = "pending-login";
    BackendErrorLabel["SUSPENDED_ACCOUNT"] = "suspended";
    BackendErrorLabel["CODE_AUTHENTICATION_REQUIRED"] = "code-authentication-required";
    BackendErrorLabel["CODE_AUTHENTICATION_FAILED"] = "code-authentication-failed";
    BackendErrorLabel["PASSWORD_AUTHENTICATION_FAILED"] = "password-authentication-failed";
    // Client errors
    BackendErrorLabel["TOO_MANY_CLIENTS"] = "too-many-clients";
    BackendErrorLabel["UNKNOWN_CLIENT"] = "unknown-client";
    BackendErrorLabel["CLIENT_CAPABILITY_REMOVED"] = "client-feature-cannot-be-removed";
    // Conversation errors
    BackendErrorLabel["TOO_MANY_MEMBERS"] = "too-many-members";
    BackendErrorLabel["NO_CONVERSATION"] = "no-conversation";
    BackendErrorLabel["NO_CONVERSATION_CODE"] = "no-conversation-code";
    BackendErrorLabel["NOT_CONNECTED"] = "not-connected";
    // Handle errors
    BackendErrorLabel["HANDLE_EXISTS"] = "handle-exists";
    BackendErrorLabel["INVALID_HANDLE"] = "invalid-handle";
    // Team errors
    /** @deprecated */
    BackendErrorLabel["NO_OTHER_OWNER"] = "no-other-owner";
    /** This error is thrown when an owner tries to delete themself */
    BackendErrorLabel["NO_SELF_DELETE_FOR_TEAM_OWNER"] = "no-self-delete-for-team-owner";
    BackendErrorLabel["NO_TEAM"] = "no-team";
    BackendErrorLabel["NO_TEAM_MEMBER"] = "no-team-member";
    BackendErrorLabel["TOO_MANY_TEAM_MEMBERS"] = "too-many-team-members";
    BackendErrorLabel["INVITE_EMAIL_EXISTS"] = "email-exists";
    BackendErrorLabel["BINDING_EXISTS"] = "binding-exists";
    BackendErrorLabel["BINDING_TEAM"] = "binding-team";
    BackendErrorLabel["NON_BINDING_TEAM"] = "non-binding-team";
    BackendErrorLabel["NON_BINDING_TEAM_MEMBERS"] = "non-binding-team-members";
    BackendErrorLabel["INVALID_TEAM_STATUS_UPDATE"] = "invalid-team-status-update";
    BackendErrorLabel["NO_MANAGED_CONVERSATION"] = "no-managed-team-conv";
    BackendErrorLabel["NO_ADD_TO_MANAGED"] = "no-add-to-managed";
    BackendErrorLabel["ACCOUNT_SUSPENDED"] = "suspended";
    // Feature errors
    BackendErrorLabel["FEATURE_LOCKED"] = "feature-locked";
    BackendErrorLabel["APP_LOCK_INVALID_TIMEOUT"] = "inactivity-timeout-too-low";
    // Payment errors
    BackendErrorLabel["EXPIRED_CARD"] = "expired_card";
    // Domain errors
    BackendErrorLabel["CUSTOM_BACKEND_NOT_FOUND"] = "custom-backend-not-found";
    // Legalhold errors
    BackendErrorLabel["LEGAL_HOLD_MISSING_CONSENT"] = "missing-legalhold-consent";
    // Service errors
    BackendErrorLabel["SERVICE_DISABLED"] = "service-disabled";
    BackendErrorLabel["TOO_MANY_SERVICES"] = "too-many-bots";
    // Federation errors
    BackendErrorLabel["FEDERATION_NOT_ALLOWED"] = "federation-denied";
    BackendErrorLabel["FEDERATION_BACKEND_NOT_FOUND"] = "srv-record-not-found";
})(BackendErrorLabel = exports.BackendErrorLabel || (exports.BackendErrorLabel = {}));
var SyntheticErrorLabel;
(function (SyntheticErrorLabel) {
    SyntheticErrorLabel["ALREADY_INVITED"] = "already-invited";
    SyntheticErrorLabel["FORBIDDEN_PHONE_NUMBER"] = "forbidden-phone-number";
    SyntheticErrorLabel["HANDLE_TOO_SHORT"] = "handle-too-short";
    SyntheticErrorLabel["INVALID_PHONE_NUMBER"] = "invalid-phone-number";
    SyntheticErrorLabel["REQUEST_CANCELLED"] = "request-cancelled";
    SyntheticErrorLabel["SERVICE_NOT_FOUND"] = "service-not-found";
    SyntheticErrorLabel["SSO_GENERIC_ERROR"] = "generic-sso-error";
    SyntheticErrorLabel["SSO_NO_SSO_CODE"] = "no-sso-code-found";
    SyntheticErrorLabel["SSO_USER_CANCELLED_ERROR"] = "user-cancelled-sso-error";
    SyntheticErrorLabel["INVITATION_NOT_FOUND"] = "invitation-not-found";
    SyntheticErrorLabel["INVITATION_MULTIPLE_FOUND"] = "invitation-multiple-found";
    SyntheticErrorLabel["UNKNOWN"] = "unknown-error";
})(SyntheticErrorLabel = exports.SyntheticErrorLabel || (exports.SyntheticErrorLabel = {}));
//# sourceMappingURL=BackendErrorLabel.js.map