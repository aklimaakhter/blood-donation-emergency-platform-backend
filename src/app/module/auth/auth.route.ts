import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { AuthController } from "./auth.controller";
import { userValidation } from "./auth.validation";
import { validateRequest } from "../../middleware/validationRequest";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.post(
	"/register",
	validateRequest(userValidation.UserRegistrationZodSchema),
	AuthController.registerUser,
);

router.post(
	"/verify-email",
	validateRequest(userValidation.UserVerifyEmailZodSchema),
	AuthController.verifyUserEmail,
);

router.post(
	"/login",
	validateRequest(userValidation.UserLoginZodSchema),
	AuthController.loginUser,
);

router.get(
	"/me",
	auth(Role.ADMIN, Role.USER, Role.DONOR, Role.ADMIN),
	AuthController.getMe,
);

router.post("/refresh-token", AuthController.refreshToken);
router.post("/google", AuthController.googleLogin);

router.post(
	"/forgot-password",
	validateRequest(userValidation.ForgotPasswordZodSchema),
	AuthController.forgotPassword,
);

router.post(
	"/reset-password",
	validateRequest(userValidation.ResetPasswordZodSchema),
	AuthController.resetPassword,
);
export const AuthRoutes = router;
