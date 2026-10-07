import type {
	Prisma,
	BloodRequest,
} from "../../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import httpStatus from "http-status";
import type {
	IBloodRequestFilterRequest,
	ICreateBloodRequestInput,
	IUpdateBloodRequestInput,
} from "./bloodRequest.interface";

const createBloodRequest = async (
	requesterId: string,
	payload: ICreateBloodRequestInput,
): Promise<BloodRequest> => {
	const result = await prisma.bloodRequest.create({
		data: {
			...payload,
			requesterId,
			dateOfDonation: new Date(payload.dateOfDonation),
		},
		include: {
			requester: {
				select: {
					id: true,
					name: true,
					email: true,
					phoneNumber: true,
				},
			},
		},
	});

	return result;
};

const getAllBloodRequests = async (filters: IBloodRequestFilterRequest) => {
	const { searchTerm, bloodGroup, district, area, status } = filters;
	const andConditions: Prisma.BloodRequestWhereInput[] = [];

	if (searchTerm) {
		andConditions.push({
			OR: [
				{ patientName: { contains: searchTerm, mode: "insensitive" } },
				{ hospitalName: { contains: searchTerm, mode: "insensitive" } },
				{ hospitalAddress: { contains: searchTerm, mode: "insensitive" } },
				{ district: { contains: searchTerm, mode: "insensitive" } },
				{ area: { contains: searchTerm, mode: "insensitive" } },
			],
		});
	}

	if (bloodGroup) andConditions.push({ bloodGroup });
	if (district)
		andConditions.push({ district: { equals: district, mode: "insensitive" } });
	if (area) andConditions.push({ area: { equals: area, mode: "insensitive" } });
	if (status) andConditions.push({ status });

	const whereConditions: Prisma.BloodRequestWhereInput =
		andConditions.length > 0 ? { AND: andConditions } : {};

	const result = await prisma.bloodRequest.findMany({
		where: whereConditions,
		include: {
			requester: {
				select: {
					id: true,
					name: true,
					email: true,
					phoneNumber: true,
				},
			},
			donor: {
				include: {
					user: {
						select: {
							name: true,
							email: true,
							phoneNumber: true,
						},
					},
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return result;
};

const getMyBloodRequests = async (userId: string) => {
	const result = await prisma.bloodRequest.findMany({
		where: { requesterId: userId },
		include: {
			donor: {
				include: {
					user: {
						select: {
							name: true,
							email: true,
							phoneNumber: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	return result;
};

const acceptBloodRequest = async (userId: string, requestId: string) => {
	const donor = await prisma.donor.findUnique({
		where: { userId },
	});

	if (!donor || donor.status !== "APPROVED") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"Only approved donors can accept blood requests",
		);
	}

	const bloodRequest = await prisma.bloodRequest.findUnique({
		where: { id: requestId },
	});

	if (!bloodRequest) {
		throw new AppError(httpStatus.NOT_FOUND, "Blood request not found");
	}

	if (bloodRequest.status !== "PENDING") {
		throw new AppError(
			httpStatus.BAD_REQUEST,
			"This request is already accepted or fulfilled",
		);
	}

	const updatedRequest = await prisma.bloodRequest.update({
		where: { id: requestId },
		data: {
			donorId: donor.id,
			status: "APPROVED",
		},
	});

	return updatedRequest;
};

const updateBloodRequestStatus = async (
	userId: string,
	requestId: string,
	payload: IUpdateBloodRequestInput,
) => {
	const bloodRequest = await prisma.bloodRequest.findUnique({
		where: { id: requestId },
	});

	if (!bloodRequest) {
		throw new AppError(httpStatus.NOT_FOUND, "Blood request not found");
	}

	const user = await prisma.user.findUnique({ where: { id: userId } });
	if (bloodRequest.requesterId !== userId && user?.role !== "ADMIN") {
		throw new AppError(
			httpStatus.FORBIDDEN,
			"You do not have permission to update this request",
		);
	}

	const result = await prisma.bloodRequest.update({
		where: { id: requestId },
		data: payload,
	});

	return result;
};

export const BloodRequestServices = {
	createBloodRequest,
	getAllBloodRequests,
	getMyBloodRequests,
	acceptBloodRequest,
	updateBloodRequestStatus,
};
