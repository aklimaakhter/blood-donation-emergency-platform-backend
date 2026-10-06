import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { PaymentController } from "./payment.controller";
import { PaymentValidation } from "./payment.validation";

const router = Router();


router.post(
  "/create",
  auth(Role.USER, Role.DONOR, Role.ADMIN),
  validateRequest(PaymentValidation.createPaymentSchema),
  PaymentController.createPayment
);


router.post(
  "/pay-payment",
  auth(Role.USER, Role.DONOR, Role.ADMIN),
  validateRequest(PaymentValidation.payPaymentSchema),
  PaymentController.payPayment
);


router.get("/bkash/callback", PaymentController.bkashCallback);


router.get(
  "/my-payments",
  auth(Role.USER, Role.DONOR, Role.ADMIN),
  PaymentController.getMyPayments
);

export const PaymentRoutes = router;