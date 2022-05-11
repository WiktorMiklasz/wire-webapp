import { BackendError, BackendErrorLabel, StatusCode, SyntheticErrorLabel } from '../../http';
export declare class FeatureError extends BackendError {
    constructor(message: string, label: BackendErrorLabel | SyntheticErrorLabel, code: StatusCode);
}
export declare class InvalidAppLockTimeoutError extends FeatureError {
    constructor(message: string, label?: BackendErrorLabel, code?: StatusCode);
}
export declare class FeatureLockedError extends FeatureError {
    constructor(message: string, label?: BackendErrorLabel, code?: StatusCode);
}
