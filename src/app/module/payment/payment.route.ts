import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { PaymentValidation } from "./payment.validation";
import { PaymentControllers } from "./payment.controller";

const router = Router();

router.post(
    "/initiate",
    auth(Role.USER, Role.DONOR, Role.ADMIN),
    validateRequest(PaymentValidation.createPaymentSchema),
    PaymentControllers.initiatePayment,
);

router.get("/webhook", PaymentControllers.paymentWebhook); 

router.get(
    "/:id",
    auth(Role.USER, Role.DONOR, Role.ADMIN),
    PaymentControllers.getPaymentById,
);

export const PaymentRoutes = router;