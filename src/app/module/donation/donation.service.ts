import httpStatus from "http-status";
import config from "../../config";
import { prisma } from "../../lib/prisma";

import { AppError } from "../../utils/AppError";
import { DonationStatus } from "../../../../generated/prisma/enums";
import Stripe from "stripe";
import { getStripe } from "../../lib/stripe";

const createCheckout = async (userId: string, amountBdt: number) => {
	const amount = Math.round(amountBdt * 100);

	const session = await getStripe().checkout.sessions.create({
		mode: "payment",
		line_items: [
			{
				quantity: 1,
				price_data: {
					currency: "usd",
					unit_amount: amount,
					product_data: { name: "Donation to BloodConnect" },
				},
			},
		],
		success_url: `${config.frontend_url}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${config.frontend_url}/payment/cancel`,
		metadata: { userId },
	});

	await prisma.donation.create({
		data: { userId, amount, stripeSessionId: session.id },
	});

	return { url: session.url, sessionId: session.id };
};

const verify = async (userId: string, sessionId: string) => {
	const donation = await prisma.donation.findUnique({
		where: { stripeSessionId: sessionId },
	});

	if (!donation || donation.userId !== userId) {
		throw new AppError(httpStatus.NOT_FOUND, "Payment not found");
	}

	if (donation.status === DonationStatus.PAID) return donation;

	const session = await getStripe().checkout.sessions.retrieve(sessionId);

	const status =
		session.payment_status === "paid"
			? DonationStatus.PAID
			: session.status === "expired"
				? DonationStatus.FAILED
				: DonationStatus.PENDING;

	return prisma.donation.update({ where: { id: donation.id }, data: { status } });
};

const getMy = async (userId: string) => {
	return prisma.donation.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
	});
};

const getAll = async () => {
	const donations = await prisma.donation.findMany({
		orderBy: { createdAt: "desc" },
	});
	const users = await prisma.user.findMany({
		where: { id: { in: [...new Set(donations.map((d) => d.userId))] } },
		select: { id: true, name: true, email: true },
	});
	const byId = new Map(users.map((u) => [u.id, u]));
	return donations.map((d) => ({ ...d, user: byId.get(d.userId) ?? null }));
};

export const DonationService = { createCheckout, verify, getMy, getAll };