import { Router } from "express";
import { upload } from "../../lib/multer";
import { auth } from "../../middleware/checkAuth";
import { Role } from "../../../../generated/prisma/enums";
import { UserController } from "./user.controller";

const router = Router();

router.patch(
	"/profile-image",
	auth(Role.ADMIN, Role.DONOR, Role.USER),
	upload.single("profile-image"),
	UserController.uploadProfileImage,
);

export const UserRoutes = router;
