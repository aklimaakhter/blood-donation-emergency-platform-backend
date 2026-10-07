import { prisma } from "../../lib/prisma";
import type { RequestUser } from "../../middleware/checkAuth";
import { ICreateReviewInput } from "./review.interface";

const createReview = async (payload: ICreateReviewInput, user: RequestUser) => {
	const donor = await prisma.donor.findUnique({
		where: { id: payload.donorId },
	});

	if (!donor) {
		throw new Error("Donor not found");
	}

	if (donor.id === user.id) {
		throw new Error("You cannot review yourself");
	}

	const review = await prisma.review.create({
		data: {
			userId: user.id,
			donorId: payload.donorId,
			rating: payload.rating,
			comment: payload.comment || null,
		},
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			donor: true,
		},
	});

	return review;
};

const getAllReviews = async () => {
	return await prisma.review.findMany({
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			donor: true,
		},
		orderBy: { createdAt: "desc" },
	});
};

const getDonorReviews = async (donorId: string) => {
	return await prisma.review.findMany({
		where: { donorId },
		include: {
			user: {
				select: {
					id: true,
					name: true,
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});
};

export const ReviewServices = {
	createReview,
	getAllReviews,
	getDonorReviews,
};
