import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { PaymentValidation } from "./payment.validation";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post(
	"/create",
	auth(Role.USER, Role.DONOR, Role.ADMIN),
	validateRequest(PaymentValidation.createPaymentSchema),
	PaymentControllers.createPayment,
);

router.post(
	"/pay-payment",
	auth(Role.USER, Role.DONOR, Role.ADMIN),
	validateRequest(PaymentValidation.payPaymentSchema),
	PaymentControllers.payPayment,
);

router.get("/bkash/callback", PaymentControllers.bkashCallback);

router.get(
	"/my-payments",
	auth(Role.USER, Role.DONOR, Role.ADMIN),
	PaymentControllers.getMyPayments,
);

export const PaymentRoutes = router;
