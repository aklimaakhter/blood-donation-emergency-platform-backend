import { prisma } from "../../lib/prisma";
import { Role } from "../../../../generated/prisma/enums";


const getAllUsers = async () => {
    const users = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    });
    return users;
};


const updateUserRole = async (userId: string, newRole: Role) => {
    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: newRole },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    return updatedUser;
};


const getDashboardStats = async () => {
    const totalUsers = await prisma.user.count();
    const totalDonors = await prisma.donor.count();
    const totalBloodRequests = await prisma.bloodRequest.count();
    
    
    const totalPayments = await prisma.payment.aggregate({
        _sum: { amount: true },
    });

    return {
        totalUsers,
        totalDonors,
        totalBloodRequests,
        totalRevenue: totalPayments._sum.amount || 0,
    };
};


const getAuditLogs = async () => {
    
    const logs = await prisma.auditLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 50,
    });
    return logs;
};

export const AdminServices = {
    getAllUsers,
    updateUserRole,
    getDashboardStats,
    getAuditLogs,
};