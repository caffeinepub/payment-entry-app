import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PaymentMode {
    chequeNumber?: string;
    date: string;
    mode: string;
    bankName?: string;
    amount: bigint;
    transactionId?: string;
}
export interface Payment {
    user: Principal;
    invoiceNumbers: Array<bigint>;
    paymentModes: Array<PaymentMode>;
}
export interface backendInterface {
    clearAllPayments(): Promise<void>;
    getAllPayments(): Promise<Array<Payment>>;
    getPaymentsByInvoiceNumber(invoiceNumber: bigint): Promise<Array<Payment>>;
    getPaymentsByMode(mode: string): Promise<Array<Payment>>;
    getPaymentsByUser(user: Principal): Promise<Array<Payment>>;
    submitPayment(invoiceNumbers: Array<bigint>, paymentModes: Array<PaymentMode>): Promise<void>;
}
