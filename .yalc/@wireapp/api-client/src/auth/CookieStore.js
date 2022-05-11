"use strict";
/*
 * Wire
 * Copyright (C) 2019 Wire Swiss GmbH
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
exports.CookieStore = void 0;
const commons_1 = require("@wireapp/commons");
const events_1 = require("events");
var TOPIC;
(function (TOPIC) {
    TOPIC["COOKIE_REFRESH"] = "CookieStore.TOPIC.COOKIE_REFRESH";
})(TOPIC || (TOPIC = {}));
class CookieStore {
    static getCookie() {
        return CookieStore.cookie;
    }
    static emit() {
        if (commons_1.Runtime.isNode()) {
            CookieStore.emitter.emit(CookieStore.TOPIC.COOKIE_REFRESH, CookieStore.cookie);
        }
    }
    static setCookie(cookie) {
        CookieStore.cookie = cookie;
        CookieStore.emit();
    }
    static deleteCookie() {
        CookieStore.cookie = undefined;
        CookieStore.emit();
    }
}
exports.CookieStore = CookieStore;
CookieStore.emitter = new events_1.EventEmitter();
CookieStore.TOPIC = TOPIC;
//# sourceMappingURL=CookieStore.js.map