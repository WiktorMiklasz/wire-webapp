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
exports.SelfDeletingTimeout = exports.FeatureLockStatus = exports.FeatureStatus = void 0;
var FeatureStatus;
(function (FeatureStatus) {
    FeatureStatus["DISABLED"] = "disabled";
    FeatureStatus["ENABLED"] = "enabled";
})(FeatureStatus = exports.FeatureStatus || (exports.FeatureStatus = {}));
var FeatureLockStatus;
(function (FeatureLockStatus) {
    FeatureLockStatus["LOCKED"] = "locked";
    FeatureLockStatus["UNLOCKED"] = "unlocked";
})(FeatureLockStatus = exports.FeatureLockStatus || (exports.FeatureLockStatus = {}));
var SelfDeletingTimeout;
(function (SelfDeletingTimeout) {
    SelfDeletingTimeout[SelfDeletingTimeout["OFF"] = 0] = "OFF";
    SelfDeletingTimeout[SelfDeletingTimeout["SECONDS_10"] = 10] = "SECONDS_10";
    SelfDeletingTimeout[SelfDeletingTimeout["MINUTES_5"] = 300] = "MINUTES_5";
    SelfDeletingTimeout[SelfDeletingTimeout["HOURS_1"] = 3600] = "HOURS_1";
    SelfDeletingTimeout[SelfDeletingTimeout["DAYS_1"] = 86400] = "DAYS_1";
    SelfDeletingTimeout[SelfDeletingTimeout["WEEKS_1"] = 604800] = "WEEKS_1";
    SelfDeletingTimeout[SelfDeletingTimeout["WEEKS_4"] = 2419200] = "WEEKS_4";
})(SelfDeletingTimeout = exports.SelfDeletingTimeout || (exports.SelfDeletingTimeout = {}));
//# sourceMappingURL=Feature.js.map