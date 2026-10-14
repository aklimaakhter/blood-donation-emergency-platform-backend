import type { Request, Response } from "express";
import httpStatus from "http-status";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DonationService } from "./donation.service";

const createCheckout = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user?.userId;
	const result = await DonationService.createCheckout(userId, req.body.amount);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Checkout session created",
		data: result,
	});
});

const verify = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user?.userId;
	const sessionId = String(req.query.session_id ?? "");
	if (!sessionId) {
		throw new AppError(httpStatus.BAD_REQUEST, "session_id is required");
	}

	const result = await DonationService.verify(userId, sessionId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Payment status fetched successfully",
		data: result,
	});
});

const getMy = catchAsync(async (req: Request, res: Response) => {
	const userId = (req as any).user?.userId;
	const result = await DonationService.getMy(userId);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Payment history fetched successfully",
		data: result,
	});
});

const getAll = catchAsync(async (_req: Request, res: Response) => {
	const result = await DonationService.getAll();

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "All payments fetched successfully",
		data: result,
	});
});

export const DonationController = { createCheckout, verify, getMy, getAll };