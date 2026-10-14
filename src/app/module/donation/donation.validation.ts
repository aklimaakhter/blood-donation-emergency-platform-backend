import { z } from "zod";

const createDonationSchema = z.object({
	amount: z
		.number({ message: "Amount is required" })
		.min(1, "Minimum donation is $1")
		.max(1000, "Maximum donation is $1000"),
});

export const DonationValidation = { createDonationSchema };