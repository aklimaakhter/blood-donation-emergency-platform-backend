import type { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

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
    
    const result = await PaymentServices.paymentWebhook(req.query);
    
    return res.redirect(result.redirectUrl);
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