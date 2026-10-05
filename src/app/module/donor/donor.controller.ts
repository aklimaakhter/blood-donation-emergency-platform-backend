import { Request, Response } from 'express';
import { DonorService } from './donor.service';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const applyForDonor = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const result = await DonorService.applyForDonor(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Donor application submitted successfully! Waiting for admin approval.',
    data: result,
  });
});

const getAllDonors = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const result = await DonorService.getAllDonors(filters);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donors retrieved successfully',
    data: result,
  });
});

const getMyDonorProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const result = await DonorService.getMyDonorProfile(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor profile fetched successfully',
    data: result,
  });
});

const updateMyDonorProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const result = await DonorService.updateMyDonorProfile(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor profile updated successfully',
    data: result,
  });
});

export const DonorController = {
  applyForDonor,
  getAllDonors,
  getMyDonorProfile,
  updateMyDonorProfile,
};