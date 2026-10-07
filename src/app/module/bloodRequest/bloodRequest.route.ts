import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validationRequest";
import { Role } from "../../../../generated/prisma/enums";
import { BloodRequestController } from "./bloodRequest.controller";
import { BloodRequestValidation } from "./bloodRequest.validation";

const router = Router();

router.get("/", BloodRequestController.getAllBloodRequests);

router.get(
	"/my-requests",
	auth(Role.USER, Role.DONOR, Role.ADMIN),
	BloodRequestController.getMyBloodRequests,
);

router.post(
	"/",
	auth(Role.USER, Role.DONOR, Role.ADMIN),
	validateRequest(BloodRequestValidation.createBloodRequestSchema),
	BloodRequestController.createBloodRequest,
);

router.patch(
	"/:id/accept",
	auth(Role.DONOR),
	BloodRequestController.acceptBloodRequest,
);

router.patch(
	"/:id/status",
	auth(Role.USER, Role.DONOR, Role.ADMIN),
	validateRequest(BloodRequestValidation.updateBloodRequestStatusSchema),
	BloodRequestController.updateBloodRequestStatus,
);

export const BloodRequestRoutes = router;
