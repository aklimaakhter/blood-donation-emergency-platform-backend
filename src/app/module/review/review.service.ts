import { prisma } from "../../lib/prisma";
import { RequestUser } from "../../middleware/checkAuth";

interface ICreateReviewInput {
  donorId: string;
  rating: number;
  comment?: string;
}

// Create a review for a donor
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

// Get all reviews (Platform-wide)
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

// Get reviews for a specific donor
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