import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Payment {
    chequeDate?: string;
    chequeNumber?: string;
    user: Principal;
    chequeAmount?: bigint;
    bankName?: string;
    invoiceNumber: bigint;
    neftAmount?: bigint;
    paymentMode: string;
    neftDate?: string;
    transactionId?: string;
}
export interface backendInterface {
    getAllPayments(): Promise<Array<Payment>>;
    getPaymentsByInvoiceNumber(invoiceNumber: bigint): Promise<Array<Payment>>;
    getPaymentsByUser(user: Principal): Promise<Array<Payment>>;
    submitPayment(invoiceNumber: bigint, paymentMode: string, transactionId: string | null, neftAmount: bigint | null, neftDate: string | null, bankName: string | null, chequeNumber: string | null, chequeAmount: bigint | null, chequeDate: string | null): Promise<void>;
}
