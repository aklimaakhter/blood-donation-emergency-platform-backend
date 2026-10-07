import { Request, Response } from "express";
import { ReviewServices } from "./review.service";
import { RequestUser } from "../../middleware/checkAuth";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createReview = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as RequestUser;
  const result = await ReviewServices.createReview(req.body, user);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review submitted successfully",
    data: result,
  });
});

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewServices.getAllReviews();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All reviews fetched successfully",
    data: result,
  });
});

const getDonorReviews = catchAsync(async (req: Request, res: Response) => {
  const { donorId } = req.params;
  const result = await ReviewServices.getDonorReviews(donorId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Donor reviews fetched successfully",
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getAllReviews,
  getDonorReviews,
};