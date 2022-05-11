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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceNotFoundError = exports.InvalidInvitationCodeError = exports.InviteEmailInUseError = exports.TeamError = exports.ServiceAPI = exports.PaymentAPI = exports.TeamAPI = exports.Role = exports.Permissions = exports.MemberAPI = exports.LegalHoldAPI = exports.TeamInvitationAPI = void 0;
var invitation_1 = require("./invitation/");
Object.defineProperty(exports, "TeamInvitationAPI", { enumerable: true, get: function () { return invitation_1.TeamInvitationAPI; } });
var legalhold_1 = require("./legalhold/");
Object.defineProperty(exports, "LegalHoldAPI", { enumerable: true, get: function () { return legalhold_1.LegalHoldAPI; } });
var member_1 = require("./member/");
Object.defineProperty(exports, "MemberAPI", { enumerable: true, get: function () { return member_1.MemberAPI; } });
Object.defineProperty(exports, "Permissions", { enumerable: true, get: function () { return member_1.Permissions; } });
Object.defineProperty(exports, "Role", { enumerable: true, get: function () { return member_1.Role; } });
var team_1 = require("./team/");
Object.defineProperty(exports, "TeamAPI", { enumerable: true, get: function () { return team_1.TeamAPI; } });
var payment_1 = require("./payment/");
Object.defineProperty(exports, "PaymentAPI", { enumerable: true, get: function () { return payment_1.PaymentAPI; } });
var service_1 = require("./service/");
Object.defineProperty(exports, "ServiceAPI", { enumerable: true, get: function () { return service_1.ServiceAPI; } });
var TeamError_1 = require("./TeamError");
Object.defineProperty(exports, "TeamError", { enumerable: true, get: function () { return TeamError_1.TeamError; } });
Object.defineProperty(exports, "InviteEmailInUseError", { enumerable: true, get: function () { return TeamError_1.InviteEmailInUseError; } });
Object.defineProperty(exports, "InvalidInvitationCodeError", { enumerable: true, get: function () { return TeamError_1.InvalidInvitationCodeError; } });
Object.defineProperty(exports, "ServiceNotFoundError", { enumerable: true, get: function () { return TeamError_1.ServiceNotFoundError; } });
__exportStar(require("./billing/"), exports);
__exportStar(require("./identityprovider/"), exports);
__exportStar(require("./scim/"), exports);
__exportStar(require("./feature/"), exports);
__exportStar(require("./conversation"), exports);
//# sourceMappingURL=index.js.map