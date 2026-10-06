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

const updateDonorStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await DonorService.updateDonorStatus(id as string, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Donor application status updated to ${status}`,
    data: result,
  });
});

const getAllDonorApplications = catchAsync(async (req: Request, res: Response) => {
  const status = req.query.status as any;
  const result = await DonorService.getAllDonorApplications(status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Donor applications retrieved successfully',
    data: result,
  });
});

export const DonorController = {
  applyForDonor,
  getAllDonors,
  getMyDonorProfile,
  updateMyDonorProfile,
  updateDonorStatus,
  getAllDonorApplications,
};