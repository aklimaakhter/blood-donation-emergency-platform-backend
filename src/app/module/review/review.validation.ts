import { z } from "zod";

const createReviewValidation = z.object({
	donorId: z.string({
		message: "Donor ID is required",
	}),
	rating: z
		.number({
			message: "Rating is required",
		})
		.min(1, "Rating must be at least 1")
		.max(5, "Rating cannot be more than 5"),
	comment: z.string().optional(),
});

export const ReviewValidation = {
	createReviewValidation,
};
