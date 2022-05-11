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
exports.UserMapper = void 0;
const event_1 = require("@wireapp/api-client/src/event");
const conversation_1 = require("../conversation");
const MessageBuilder_1 = require("../conversation/message/MessageBuilder");
class UserMapper {
    static mapUserEvent(event, selfUserId, source) {
        switch (event.type) {
            case event_1.USER_EVENT.CONNECTION: {
                const { connection, user } = event;
                return {
                    content: { connection, user },
                    conversation: connection.conversation,
                    from: connection.from,
                    id: MessageBuilder_1.MessageBuilder.createId(),
                    messageTimer: 0,
                    source,
                    state: conversation_1.PayloadBundleState.INCOMING,
                    timestamp: new Date(connection.last_update).getTime(),
                    type: conversation_1.PayloadBundleType.CONNECTION_REQUEST,
                };
            }
            case event_1.USER_EVENT.CLIENT_ADD: {
                const { client } = event;
                return {
                    content: { client },
                    conversation: selfUserId,
                    from: selfUserId,
                    id: MessageBuilder_1.MessageBuilder.createId(),
                    messageTimer: 0,
                    source,
                    state: conversation_1.PayloadBundleState.INCOMING,
                    timestamp: new Date().getTime(),
                    type: conversation_1.PayloadBundleType.CLIENT_ADD,
                };
            }
            case event_1.USER_EVENT.UPDATE: {
                const { user } = event;
                return {
                    content: { user },
                    conversation: selfUserId,
                    from: selfUserId,
                    id: MessageBuilder_1.MessageBuilder.createId(),
                    source,
                    state: conversation_1.PayloadBundleState.INCOMING,
                    timestamp: new Date().getTime(),
                    type: conversation_1.PayloadBundleType.USER_UPDATE,
                };
            }
            case event_1.USER_EVENT.CLIENT_REMOVE: {
                const { client } = event;
                return {
                    content: { client },
                    conversation: selfUserId,
                    from: selfUserId,
                    id: MessageBuilder_1.MessageBuilder.createId(),
                    messageTimer: 0,
                    source,
                    state: conversation_1.PayloadBundleState.INCOMING,
                    timestamp: new Date().getTime(),
                    type: conversation_1.PayloadBundleType.CLIENT_REMOVE,
                };
            }
        }
    }
}
exports.UserMapper = UserMapper;
//# sourceMappingURL=UserMapper.js.map