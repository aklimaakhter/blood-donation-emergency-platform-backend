import type { Request, Response } from "express";
import httpStatus from "http-status";
import config from "../../config";
import { AppError } from "../../utils/AppError";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { IRequestUser } from "./auth.interface";
import { AuthService } from "./auth.service";

const isProduction = config.node_env === "production";

const accessTokenCookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: isProduction ? ("none" as const) : ("lax" as const),
	maxAge: 1000 * 60 * 60 * 24,
};

const refreshTokenCookieOptions = {
	httpOnly: true,
	secure: isProduction,
	sameSite: isProduction ? ("none" as const) : ("lax" as const),
	maxAge: 1000 * 60 * 60 * 24 * 7,
};

const registerUser = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.registerUser(payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Email verification OTP sent successfully",
		data: result,
	});
});

const verifyUserEmail = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.verifyUserEmail(payload);
	const { accessToken, refreshToken, user } = result;

	res.cookie("accessToken", accessToken, accessTokenCookieOptions);
	res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

	sendResponse(res, {
		statusCode: httpStatus.CREATED,
		success: true,
		message: "Email verified successfully.",
		data: {
			accessToken,
			refreshToken,
			user,
		},
	});
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.loginUser(payload);
	const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, accessTokenCookieOptions);
	res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User logged in successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

const getMe = catchAsync(async (req: Request, res: Response) => {
	const user = req.user as unknown as IRequestUser;

	if (!user) {
		throw new AppError(
			httpStatus.UNAUTHORIZED,
			"Unauthorized access. User information is missing",
		);
	}

	const result = await AuthService.getMe(user);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "User profile fetched successfully",
		data: result,
	});
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	const token = req.cookies.refreshToken;

	if (!token) {
		throw new AppError(httpStatus.UNAUTHORIZED, "Refresh token is missing");
	}

	const result = await AuthService.refreshToken(token);
	const { accessToken, refreshToken: newRefreshToken } = result;

	res.cookie("accessToken", accessToken, accessTokenCookieOptions);
	res.cookie("refreshToken", newRefreshToken, refreshTokenCookieOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "New tokens generated successfully",
		data: {
			accessToken,
			refreshToken: newRefreshToken,
		},
	});
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.googleLogin(payload);
	const { accessToken, refreshToken } = result;

	res.cookie("accessToken", accessToken, accessTokenCookieOptions);
	res.cookie("refreshToken", refreshToken, refreshTokenCookieOptions);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Google login successfully",
		data: {
			accessToken,
			refreshToken,
		},
	});
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.forgotPassword(payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: `Password reset OTP sent to: ${payload.email}`,
		data: result,
	});
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const payload = req.body;

	const result = await AuthService.resetPassword(payload);

	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Password changed successfully",
		data: result,
	});
});

export const AuthController = {
	registerUser,
	verifyUserEmail,
	loginUser,
	getMe,
	refreshToken,
	googleLogin,
	forgotPassword,
	resetPassword,
};
