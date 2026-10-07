import { Router } from "express";
import { AdminController } from "./admin.controller";

import { Role } from "../../../../generated/prisma/enums";
import { auth } from "../../middleware/checkAuth";

const router = Router();

router.get("/analytics", auth(Role.ADMIN), AdminController.getAdminAnalytics);

export const AdminRoutes = router;
