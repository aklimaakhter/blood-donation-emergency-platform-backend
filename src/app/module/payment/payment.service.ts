import { Prisma } from "../../../../generated/prisma/client";
import { PaymentStatus } from "../../../../generated/prisma/enums";
import config from "../../config";
import { getBkashIdToken } from "../../lib/bkash";
import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middleware/checkAuth";
import type { ICreatePaymentInput, IPayPaymentInput } from "./payment.interface";

const createPayment = async (
	payload: ICreatePaymentInput,
	user: RequestUser,
) => {
	return await prisma.$transaction(async (tx) => {
		const bkashIdToken = await getBkashIdToken();

		if (!bkashIdToken) {
			throw new Error("No bkash access token found");
		}

		const payerRef = payload.payerReference || user.email;
		const amountStr = payload.amount ? String(payload.amount) : "0";

		const initialPayment = await tx.payment.create({
			data: {
				userId: user.id,
				bloodRequestId: payload.bloodRequestId || null,
				amount: new Prisma.Decimal(amountStr),
				status: PaymentStatus.PENDING,
				payerReference: payerRef,
				merchantInvoiceNumber: `INV-${Date.now()}-${Math.floor(
					Math.random() * 1000,
				)}`,
			},
		});

		const bkashCreatePaymentResponse = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/create`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashIdToken,
					"X-App-Key": config.bkash_app_key,
				},
				body: JSON.stringify({
					mode: "0011",
					payerReference: payerRef,
					callbackURL: `${config.bkash_callback_url}/payments/bkash/callback`,
					amount: amountStr,
					currency: "BDT",
					intent: "sale",
					merchantInvoiceNumber: initialPayment.merchantInvoiceNumber,
				}),
			},
		);

		const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

		const updatedPayment = await tx.payment.update({
			where: { id: initialPayment.id },
			data: {
				bkashPaymentId: bkashCreatePaymentResult.paymentID || null,
			},
		});

		return {
			paymentUrl: bkashCreatePaymentResult.bkashURL,
			payment: updatedPayment,
		};
	});
};

const payPayment = async (payload: IPayPaymentInput, user: RequestUser) => {
	if (!payload.paymentId) {
		throw new Error("Payment ID is required.");
	}

	const existingPayment = await prisma.payment.findUnique({
		where: { id: payload.paymentId },
	});

	if (!existingPayment) {
		throw new Error("Payment record not found.");
	}

	const bkashIdToken = await getBkashIdToken();

	if (!bkashIdToken) {
		throw new Error("No bkash access token found");
	}

	const payerRef =
		payload.payerReference || existingPayment.payerReference || user.email;

	let amountStr = "0";
	if (payload.amount) {
		amountStr = String(payload.amount);
	} else if (existingPayment.amount) {
		amountStr = existingPayment.amount.toString();
	}

	if (Number(amountStr) <= 0) {
		throw new Error("Invalid payment amount. Amount must be greater than 0.");
	}

	const bkashCreatePaymentResponse = await fetch(
		`${config.bkash_base_url}/tokenized/checkout/create`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
				Authorization: bkashIdToken,
				"X-App-Key": config.bkash_app_key,
			},
			body: JSON.stringify({
				mode: "0011",
				payerReference: payerRef,
				callbackURL: `${config.bkash_callback_url}/payments/bkash/callback`,
				amount: amountStr,
				currency: "BDT",
				intent: "sale",
				merchantInvoiceNumber: existingPayment.merchantInvoiceNumber,
			}),
		},
	);

	const bkashCreatePaymentResult = await bkashCreatePaymentResponse.json();

	const updatedPayment = await prisma.payment.update({
		where: { id: existingPayment.id },
		data: {
			bkashPaymentId: bkashCreatePaymentResult.paymentID || null,
			status: PaymentStatus.PENDING,
		},
	});

	return {
		paymentUrl: bkashCreatePaymentResult.bkashURL,
		payment: updatedPayment,
	};
};

const bkashCallback = async (query: Record<string, any>) => {
	const paymentId = query.paymentID;
	const status = query.status;

	if (!paymentId) throw new Error("PaymentID is missing");
	if (!status) throw new Error("Status is missing");

	const frontendUrl = config.frontend_url || "http://localhost:3000";

	if (status === "success") {
		const bkashIdToken = await getBkashIdToken();

		if (!bkashIdToken) {
			throw new Error("No bkash access token found");
		}

		const executedPaymentResponse = await fetch(
			`${config.bkash_base_url}/tokenized/checkout/execute`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
					Authorization: bkashIdToken,
					"X-App-Key": config.bkash_app_key,
				},
				body: JSON.stringify({ paymentID: paymentId }),
			},
		);

		const executedPaymentResult = await executedPaymentResponse.json();

		const updatedPayment = await prisma.payment.update({
			where: { bkashPaymentId: paymentId },
			data: {
				status: PaymentStatus.PAID,
				bkashTrxId: executedPaymentResult.trxID,
				paidAt:
					executedPaymentResult.paymentExecuteTime || new Date().toISOString(),
			},
		});

		return {
			redirectUrl: `${frontendUrl}/payment/success?transactionId=${updatedPayment.bkashTrxId}&paymentId=${updatedPayment.id}`,
		};
	} else if (status === "failure") {
		const updatedPayment = await prisma.payment.update({
			where: { bkashPaymentId: paymentId },
			data: {
				status: PaymentStatus.FAILED,
			},
		});

		return {
			redirectUrl: `${frontendUrl}/payment/failed?paymentId=${updatedPayment.id}`,
		};
	} else if (status === "cancel") {
		const updatedPayment = await prisma.payment.update({
			where: { bkashPaymentId: paymentId },
			data: {
				status: PaymentStatus.CANCELLED,
			},
		});

		return {
			redirectUrl: `${frontendUrl}/payment/cancel?paymentId=${updatedPayment.id}`,
		};
	} else {
		throw new Error("Invalid payment status received");
	}
};

const getMyPayments = async (user: RequestUser) => {
	return await prisma.payment.findMany({
		where: { userId: user.id },
		include: {
			bloodRequest: true,
		},
		orderBy: { createdAt: "desc" },
	});
};

export const PaymentServices = {
	createPayment,
	payPayment,
	bkashCallback,
	getMyPayments,
};
