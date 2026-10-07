import { prisma } from "../../lib/prisma";

const getAdminAnalytics = async () => {
	const totalUsers = await prisma.user.count();
	const totalDonors = await prisma.donor.count();
	const approvedDonors = await prisma.donor.count({
		where: { status: "APPROVED" },
	});
	const totalBloodRequests = await prisma.bloodRequest.count();
	const totalPayments = await prisma.payment.aggregate({
		_sum: { amount: true },
	});

	return {
		totalUsers,
		totalDonors,
		approvedDonors,
		totalBloodRequests,
		totalRevenue: totalPayments._sum.amount || 0,
	};
};

export const AdminServices = {
	getAdminAnalytics,
};
