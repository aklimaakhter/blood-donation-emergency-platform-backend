// import { Router } from "express";
// import { Role } from "../../../../generated/prisma/enums";
// import { auth } from "../../middleware/checkAuth";
// import { validateRequest } from "../../middleware/validationRequest";
// import { PaymentValidation } from "./payment.validation";
// import { PaymentControllers } from "./payment.controller";

// const router = Router();

// router.post(
// 	"/create",
// 	auth(Role.USER, Role.DONOR, Role.ADMIN),
// 	validateRequest(PaymentValidation.createPaymentSchema),
// 	PaymentControllers.createPayment,
// );

// router.post(
// 	"/pay-payment",
// 	auth(Role.USER, Role.DONOR, Role.ADMIN),
// 	validateRequest(PaymentValidation.payPaymentSchema),
// 	PaymentControllers.payPayment,
// );

// router.get("/bkash/callback", PaymentControllers.bkashCallback);

// router.get(
// 	"/my-payments",
// 	auth(Role.USER, Role.DONOR, Role.ADMIN),
// 	PaymentControllers.getMyPayments,
// );

// export const PaymentRoutes = router;



import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { PaymentValidation } from "./payment.validation";
import { PaymentControllers } from "./payment.controller";

const router = Router();

// ১. পেমেন্ট ইনিশিয়েট করা
router.post(
    "/initiate",
    auth(Role.USER, Role.DONOR, Role.ADMIN),
    validateRequest(PaymentValidation.createPaymentSchema),
    PaymentControllers.initiatePayment,
);

// ২. পেমেন্ট ওয়েহুক (বিকাশ বা গেটওয়ে কলব্যাক/ওয়েহুক)
router.post("/webhook", PaymentControllers.paymentWebhook);

// ৩. নির্দিষ্ট পেমেন্ট আইডি দিয়ে পেমেন্টের তথ্য আনা
router.get(
    "/:id",
    auth(Role.USER, Role.DONOR, Role.ADMIN),
    PaymentControllers.getPaymentById,
);

export const PaymentRoutes = router;