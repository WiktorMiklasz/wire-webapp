import { BackendError, BackendErrorLabel, StatusCode, SyntheticErrorLabel } from '../../http';
export declare class InvitationError extends BackendError {
    constructor(message: string, label: BackendErrorLabel | SyntheticErrorLabel, code: StatusCode);
}
export declare class InvitationInvalidEmailError extends InvitationError {
    constructor(message: string, label?: BackendErrorLabel, code?: StatusCode);
}
export declare class InvitationInvalidPhoneError extends InvitationError {
    constructor(message: string, label?: BackendErrorLabel, code?: StatusCode);
}
export declare class InvitationEmailExistsError extends InvitationError {
    constructor(message: string, label?: BackendErrorLabel, code?: StatusCode);
}
export declare class InvitationPhoneExistsError extends InvitationError {
    constructor(message: string, label?: BackendErrorLabel, code?: StatusCode);
}
export declare class InvitationNotFoundError extends InvitationError {
    constructor(message: string, label?: SyntheticErrorLabel, code?: StatusCode);
}
export declare class InvitationMultipleError extends InvitationError {
    constructor(message: string, label?: SyntheticErrorLabel, code?: StatusCode);
}
