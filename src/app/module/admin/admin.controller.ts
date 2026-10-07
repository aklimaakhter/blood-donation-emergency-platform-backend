import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAdminAnalytics = catchAsync(async (req: Request, res: Response) => {
	const result = await AdminServices.getAdminAnalytics();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Admin analytics fetched successfully",
		data: result,
	});
});

export const AdminController = {
	getAdminAnalytics,
};
