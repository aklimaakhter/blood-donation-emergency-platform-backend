import type { PaymentStatus } from "../../../../generated/prisma/enums";

export interface ICreatePaymentInput {
	amount: number | string;
	bloodRequestId?: string;
	payerReference?: string;
}

export interface IPayPaymentInput {
	paymentId: string;
	amount?: number | string;
	payerReference?: string;
}

export type IPayment = {
	id: string;
	userId: string;
	status: PaymentStatus;
	amount: number;
	currency: string;
	paymentGateway: string;
	merchantInvoiceNumber: string;
	bkashPaymentId?: string | null;
	bkashTrxId?: string | null;
	payerReference?: string | null;
	paidAt?: string | null;
	gatewayResponse?: Record<string, any> | null;
	createdAt: Date;
	updatedAt: Date;
};

export type IBkashCallbackQuery = {
	paymentID?: string;
	status?: "success" | "failure" | "cancel";
	apiVersion?: string;
};
