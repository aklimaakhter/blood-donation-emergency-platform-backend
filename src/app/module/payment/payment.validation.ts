import { z } from "zod";

const createPaymentSchema = z.object({
  amount: z.string("Amount is required" ),
    reason: z.string().optional()
});

const payPaymentSchema = z.object({
  paymentId: z.string("Payment ID is required"),
});

const cancelPaymentSchema = z.object({
  paymentId: z.string("Payment ID is required"),
    reason: z.string().optional(),
});

export const PaymentValidation = {
  createPaymentSchema,
  payPaymentSchema,
  cancelPaymentSchema,
};