import type { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminServices } from "./admin.service";

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.getAllUsers();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Users fetched successfully",
        data: result,
    });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;
    const result = await AdminServices.updateUserRole(id as string, role);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "User role updated successfully",
        data: result,
    });
});

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.getDashboardStats();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Dashboard stats fetched successfully",
        data: result,
    });
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminServices.getAuditLogs();

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Audit logs fetched successfully",
        data: result,
    });
});

export const AdminController = {
    getAllUsers,
    updateUserRole,
    getDashboardStats,
    getAuditLogs,
};
