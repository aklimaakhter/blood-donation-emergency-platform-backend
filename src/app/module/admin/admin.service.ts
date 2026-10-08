// import { prisma } from "../../lib/prisma";

// const getAdminAnalytics = async () => {
// 	const totalUsers = await prisma.user.count();
// 	const totalDonors = await prisma.donor.count();
// 	const approvedDonors = await prisma.donor.count({
// 		where: { status: "APPROVED" },
// 	});
// 	const totalBloodRequests = await prisma.bloodRequest.count();
// 	const totalPayments = await prisma.payment.aggregate({
// 		_sum: { amount: true },
// 	});

// 	return {
// 		totalUsers,
// 		totalDonors,
// 		approvedDonors,
// 		totalBloodRequests,
// 		totalRevenue: totalPayments._sum.amount || 0,
// 	};
// };

// export const AdminServices = {
// 	getAdminAnalytics,
// };



import { prisma } from "../../lib/prisma";
import { Role } from "../../../../generated/prisma/enums";

// ১. সমস্ত ইউজার ফেচ করার সার্ভিস
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

// ২. ইউজারের রোল আপডেট করার সার্ভিস
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

// ৩. ড্যাশবোর্ড স্ট্যাটস ফেচ করার সার্ভিস
const getDashboardStats = async () => {
    const totalUsers = await prisma.user.count();
    const totalDonors = await prisma.donor.count();
    const totalBloodRequests = await prisma.bloodRequest.count();
    
    // পেমেন্ট বা অন্যান্য স্ট্যাটস প্রয়োজন অনুযায়ী যোগ করতে পারেন
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