// import type { Request, Response } from "express";
// import httpStatus from "http-status";
// import { PaymentServices } from "./payment.service";
// import { catchAsync } from "../../utils/catchAsync";
// import { sendResponse } from "../../utils/sendResponse";

// const createPayment = catchAsync(async (req: Request, res: Response) => {
// 	const result = await PaymentServices.createPayment(
// 		req.body,
// 		(req as any).user,
// 	);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Payment URL generated successfully",
// 		data: result,
// 	});
// });

// const payPayment = catchAsync(async (req: Request, res: Response) => {
// 	const result = await PaymentServices.payPayment(req.body, (req as any).user);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Payment retry URL generated successfully",
// 		data: result,
// 	});
// });

// const bkashCallback = catchAsync(async (req: Request, res: Response) => {
// 	const result = await PaymentServices.bkashCallback(req.query);
// 	return res.redirect(result.redirectUrl);
// });

// const getMyPayments = catchAsync(async (req: Request, res: Response) => {
// 	const result = await PaymentServices.getMyPayments((req as any).user);

// 	sendResponse(res, {
// 		statusCode: httpStatus.OK,
// 		success: true,
// 		message: "Payments fetched successfully",
// 		data: result,
// 	});
// });

// export const PaymentControllers = {
// 	createPayment,
// 	payPayment,
// 	bkashCallback,
// 	getMyPayments,
// };


import type { Request, Response } from "express";
import httpStatus from "http-status";
import { PaymentServices } from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentServices.initiatePayment(
        req.body,
        (req as any).user,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment initiated successfully",
        data: result,
    });
});

const paymentWebhook = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentServices.paymentWebhook(req.body, req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Webhook processed successfully",
        data: result,
    });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PaymentServices.getPaymentById(id as string, (req as any).user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment details fetched successfully",
        data: result,
    });
});

export const PaymentControllers = {
    initiatePayment,
    paymentWebhook,
    getPaymentById,
};