import { Router } from "express";
import { ReviewControllers } from "./review.controller";
import { ReviewValidation } from "./review.validation";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";

const router = Router();

router.post(
	"/",
	auth(),
	validateRequest(ReviewValidation.createReviewValidation),
	ReviewControllers.createReview,
);

router.get("/", ReviewControllers.getAllReviews);

router.get("/donor/:donorId", ReviewControllers.getDonorReviews);

export const ReviewRoutes = router;
