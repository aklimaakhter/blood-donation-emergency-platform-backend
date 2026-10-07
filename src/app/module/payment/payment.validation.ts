import { z } from "zod";

const createPaymentSchema = z.object({
	amount: z.number({ message: "Amount is required" }),
	bloodRequestId: z.string().optional(),
	reason: z.string().optional(),
});

const payPaymentSchema = z.object({
	paymentId: z.string({ message: "Payment ID is required" }),
	amount: z.number().optional(),
	payerReference: z.string().optional(),
});

const cancelPaymentSchema = z.object({
	paymentId: z.string({ message: "Payment ID is required" }),
	reason: z.string().optional(),
});

export const PaymentValidation = {
	createPaymentSchema,
	payPaymentSchema,
	cancelPaymentSchema,
};
