/** biome-ignore-all lint/style/noNonNullAssertion: <explanation> */
import { Request, Response } from "express";
import httpStatus from "http-status";
import { PaymentServices } from "./payment.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.createPayment(req.body, req.user!);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Payment URL generated successfully",
    data: result,
  });
});

const payPayment = catchAsync(async (req: Request, res: Response) => {
  // req.body mathae rakha dorkar
  const result = await PaymentServices.payPayment(req.body, (req as any).user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment retry URL generated successfully",
    data: result,
  });
});

const bkashCallback = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentServices.bkashCallback(req.query);

  // sendResponse-er bodol-e shorasori res.redirect() likhun:
  return res.redirect(result.redirectUrl);
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
  const user = (req as any).user;
  const result = await PaymentServices.getMyPayments(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My payments fetched successfully",
    data: result,
  });
});

export const PaymentController = {
  createPayment,
  payPayment,
  bkashCallback,
  getMyPayments,
};