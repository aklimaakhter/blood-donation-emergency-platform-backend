import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await PaymentServices.createPayment(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment initiated successfully",
    data: result,
  });
});

const payPayment = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await PaymentServices.payPayment(req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retry URL generated successfully",
    data: result,
  });
});

const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.bkashCallback(req.query);

  if (result.redirectUrl) {
    return res.redirect(result.redirectUrl);
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "bKash callback processed successfully",
    data: result,
  });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const result = await PaymentServices.getMyPayments(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My payments retrieved successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  payPayment,
  bkashCallback,
  getMyPayments,
};