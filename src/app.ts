import cookieParser from "cookie-parser";
import cors from "cors";
import express, {
	type Application,
	type Request,
	type Response,
} from "express";
import httpStatus from "http-status";
import config from "./app/config";
import { globalErrorHandler } from "./app/middleware/globalErrorHandler";
import { notFound } from "./app/middleware/notFound";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { DonorRoutes } from "./app/module/donor/donor.route";
import { UserRoutes } from "./app/module/user/user.route";
import { BloodRequestRoutes } from "./app/module/bloodRequest/bloodRequest.route";
import { PaymentRoutes } from "./app/module/payment/payment.route";
import { ReviewRoutes } from "./app/module/review/review.route";
import { AdminRoutes } from "./app/module/admin/admin.route";

const app: Application = express();

app.use(
	cors({
		origin: config.frontend_url,
		credentials: true,
	}),
);

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/donor", DonorRoutes);
app.use("/api/v1/blood-request", BloodRequestRoutes);
app.use("/api/v1/payments", PaymentRoutes);
app.use("/api/v1/review", ReviewRoutes);
app.use("/api/v1/admin", AdminRoutes);

app.get("/", async (req: Request, res: Response) => {
	res.status(httpStatus.OK).json({
		success: true,
		message: "Welcome to Blood Donation & Emergency Platform Backend",
	});
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
