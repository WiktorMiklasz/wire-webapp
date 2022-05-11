import type { SupportedCurrency } from '../payment/';
declare enum PaymentStripeChargeStatus {
    FAILED = "failed",
    PENDING = "pending",
    SUCCEEDED = "succeeded"
}
export interface PaymentStripeCharge {
    amount: number;
    created: number;
    currency: SupportedCurrency;
    failureCode: string;
    failureMessage: string;
    id: string;
    invoice: string;
    livemode: boolean;
    paid: boolean;
    status: PaymentStripeChargeStatus;
}
export {};
