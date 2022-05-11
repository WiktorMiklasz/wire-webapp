import type { UserActivateData, UserClientAddData, UserClientRemoveData, UserConnectionData, UserDeleteData, UserLegalHoldDisableData, UserLegalHoldEnableData, UserLegalHoldRequestData, UserPropertiesDeleteData, UserPropertiesSetData, UserPushRemoveData, UserUpdateData } from '../user/data';
export declare enum USER_EVENT {
    ACTIVATE = "user.activate",
    CLIENT_ADD = "user.client-add",
    CLIENT_REMOVE = "user.client-remove",
    CONNECTION = "user.connection",
    DELETE = "user.delete",
    LEGAL_HOLD_DISABLE = "user.legalhold-disable",
    LEGAL_HOLD_ENABLE = "user.legalhold-enable",
    LEGAL_HOLD_REQUEST = "user.legalhold-request",
    PROPERTIES_DELETE = "user.properties-delete",
    PROPERTIES_SET = "user.properties-set",
    PUSH_REMOVE = "user.push-remove",
    UPDATE = "user.update"
}
export declare type UserEventData = UserActivateData | UserClientAddData | UserLegalHoldRequestData | UserLegalHoldEnableData | UserLegalHoldDisableData | UserClientRemoveData | UserConnectionData | UserDeleteData | UserPropertiesSetData | UserPropertiesDeleteData | UserUpdateData | UserPushRemoveData | null;
export declare type UserEvent = UserActivateEvent | UserClientAddEvent | UserLegalHoldRequestEvent | UserLegalHoldEnableEvent | UserLegalHoldDisableEvent | UserClientRemoveEvent | UserConnectionEvent | UserDeleteEvent | UserPropertiesSetEvent | UserPropertiesDeleteEvent | UserUpdateEvent | UserPushRemoveEvent;
export interface BaseUserEvent {
    type: USER_EVENT;
}
export interface UserActivateEvent extends BaseUserEvent, UserActivateData {
    type: USER_EVENT.ACTIVATE;
}
export interface UserClientAddEvent extends BaseUserEvent, UserClientAddData {
    type: USER_EVENT.CLIENT_ADD;
}
export interface UserLegalHoldRequestEvent extends BaseUserEvent, UserLegalHoldRequestData {
    type: USER_EVENT.LEGAL_HOLD_REQUEST;
}
export interface UserLegalHoldEnableEvent extends BaseUserEvent, UserLegalHoldEnableData {
    type: USER_EVENT.LEGAL_HOLD_ENABLE;
}
export interface UserLegalHoldDisableEvent extends BaseUserEvent, UserLegalHoldDisableData {
    type: USER_EVENT.LEGAL_HOLD_DISABLE;
}
export interface UserClientRemoveEvent extends BaseUserEvent, UserClientRemoveData {
    type: USER_EVENT.CLIENT_REMOVE;
}
export interface UserConnectionEvent extends BaseUserEvent, UserConnectionData {
    type: USER_EVENT.CONNECTION;
}
export interface UserDeleteEvent extends BaseUserEvent, UserDeleteData {
    type: USER_EVENT.DELETE;
}
export interface UserPropertiesSetEvent extends BaseUserEvent, UserPropertiesSetData {
    type: USER_EVENT.PROPERTIES_SET;
}
export interface UserPropertiesDeleteEvent extends BaseUserEvent, UserPropertiesDeleteData {
    type: USER_EVENT.PROPERTIES_DELETE;
}
export interface UserUpdateEvent extends BaseUserEvent, UserUpdateData {
    type: USER_EVENT.UPDATE;
}
export interface UserPushRemoveEvent extends BaseUserEvent, UserPushRemoveData {
    type: USER_EVENT.PUSH_REMOVE;
}
