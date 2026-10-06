import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { BloodRequestServices } from './bloodRequest.service';

const createBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const requesterId = (req as any).user?.userId;
  const result = await BloodRequestServices.createBloodRequest(requesterId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Blood request created successfully',
    data: result,
  });
});

const getAllBloodRequests = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const result = await BloodRequestServices.getAllBloodRequests(filters);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood requests retrieved successfully',
    data: result,
  });
});

const getMyBloodRequests = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const result = await BloodRequestServices.getMyBloodRequests(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My blood requests fetched successfully',
    data: result,
  });
});

const acceptBloodRequest = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { id } = req.params;
  const result = await BloodRequestServices.acceptBloodRequest(userId, id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request accepted successfully',
    data: result,
  });
});

const updateBloodRequestStatus = catchAsync(async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  const { id } = req.params;
  const result = await BloodRequestServices.updateBloodRequestStatus(userId, id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Blood request status updated successfully',
    data: result,
  });
});

export const BloodRequestController = {
  createBloodRequest,
  getAllBloodRequests,
  getMyBloodRequests,
  acceptBloodRequest,
  updateBloodRequestStatus,
};