import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { DonationController } from "./donation.controller";
import { DonationValidation } from "./donation.validation";

const router = Router();

router.post(
	"/checkout",
	auth(Role.USER, Role.DONOR, Role.ADMIN),
	validateRequest(DonationValidation.createDonationSchema),
	DonationController.createCheckout,
);

router.get("/verify", auth(Role.USER, Role.DONOR, Role.ADMIN), DonationController.verify);

router.get("/my", auth(Role.USER, Role.DONOR, Role.ADMIN), DonationController.getMy);

router.get("/", auth(Role.ADMIN), DonationController.getAll);

export const DonationRoutes = router;