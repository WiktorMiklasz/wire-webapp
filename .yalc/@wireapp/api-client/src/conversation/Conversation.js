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
exports.CONVERSATION_ACCESS = exports.ACCESS_ROLE_V2 = exports.CONVERSATION_ACCESS_ROLE = exports.CONVERSATION_TYPE = void 0;
var CONVERSATION_TYPE;
(function (CONVERSATION_TYPE) {
    CONVERSATION_TYPE[CONVERSATION_TYPE["REGULAR"] = 0] = "REGULAR";
    CONVERSATION_TYPE[CONVERSATION_TYPE["SELF"] = 1] = "SELF";
    CONVERSATION_TYPE[CONVERSATION_TYPE["ONE_TO_ONE"] = 2] = "ONE_TO_ONE";
    CONVERSATION_TYPE[CONVERSATION_TYPE["CONNECT"] = 3] = "CONNECT";
})(CONVERSATION_TYPE = exports.CONVERSATION_TYPE || (exports.CONVERSATION_TYPE = {}));
var CONVERSATION_ACCESS_ROLE;
(function (CONVERSATION_ACCESS_ROLE) {
    CONVERSATION_ACCESS_ROLE["ACTIVATED"] = "activated";
    CONVERSATION_ACCESS_ROLE["NON_ACTIVATED"] = "non_activated";
    CONVERSATION_ACCESS_ROLE["PRIVATE"] = "private";
    CONVERSATION_ACCESS_ROLE["TEAM"] = "team";
})(CONVERSATION_ACCESS_ROLE = exports.CONVERSATION_ACCESS_ROLE || (exports.CONVERSATION_ACCESS_ROLE = {}));
var ACCESS_ROLE_V2;
(function (ACCESS_ROLE_V2) {
    ACCESS_ROLE_V2["TEAM_MEMBER"] = "team_member";
    ACCESS_ROLE_V2["SERVICE"] = "service";
    ACCESS_ROLE_V2["NON_TEAM_MEMBER"] = "non_team_member";
    ACCESS_ROLE_V2["GUEST"] = "guest";
})(ACCESS_ROLE_V2 = exports.ACCESS_ROLE_V2 || (exports.ACCESS_ROLE_V2 = {}));
var CONVERSATION_ACCESS;
(function (CONVERSATION_ACCESS) {
    CONVERSATION_ACCESS["CODE"] = "code";
    CONVERSATION_ACCESS["INVITE"] = "invite";
    CONVERSATION_ACCESS["LINK"] = "link";
    CONVERSATION_ACCESS["PRIVATE"] = "private";
})(CONVERSATION_ACCESS = exports.CONVERSATION_ACCESS || (exports.CONVERSATION_ACCESS = {}));
//# sourceMappingURL=Conversation.js.map