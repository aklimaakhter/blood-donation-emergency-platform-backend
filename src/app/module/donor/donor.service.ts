import path from "path";
import ejs from "ejs";
import {
	type Donor,
	DonorStatus,
	type Prisma,
} from "../../../../generated/prisma/browser";
import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import type {
	ICreateDonorInput,
	IDonorFilterRequest,
	IUpdateDonorProfileInput,
} from "./donor.interface";
import config from "../../config";
import { transporter } from "../../lib/nodemailer";

const applyForDonor = async (
	userId: string,
	payload: ICreateDonorInput,
): Promise<Donor> => {
	const existingDonor = await prisma.donor.findUnique({
		where: { userId },
	});

	if (existingDonor) {
		if (existingDonor.status === DonorStatus.APPROVED) {
			throw new AppError(400, "You are already an approved donor");
		}
		if (existingDonor.status === DonorStatus.PENDING) {
			throw new AppError(
				400,
				"Your donor application is already pending review",
			);
		}

		if (existingDonor.status === DonorStatus.REJECTED) {
			const rejectedTime = new Date(existingDonor.updatedAt).getTime();
			const currentTime = new Date().getTime();
			const hoursPassed = (currentTime - rejectedTime) / (1000 * 60 * 60);
			const COOLDOWN_HOURS = 24;

			if (hoursPassed < COOLDOWN_HOURS) {
				const remainingHours = Math.ceil(COOLDOWN_HOURS - hoursPassed);
				throw new AppError(
					400,
					`Your previous application was rejected. You can apply again after ${remainingHours} hours.`,
				);
			} else {
				await prisma.donor.delete({
					where: { userId },
				});
			}
		}
	}

	const result = await prisma.donor.create({
		data: {
			userId,
			bloodGroup: payload.bloodGroup,
			district: payload.district,
			area: payload.area,
			lastDonatedDate: payload.lastDonatedDate
				? new Date(payload.lastDonatedDate)
				: null,
			status: DonorStatus.PENDING,
		},
	});

	return result;
};

const getAllDonors = async (filters: IDonorFilterRequest) => {
	const { searchTerm, bloodGroup, district, area, isAvailable } = filters;
	const andConditions: Prisma.DonorWhereInput[] = [
		{ status: DonorStatus.APPROVED },
	];

	if (searchTerm) {
		andConditions.push({
			OR: [
				{ district: { contains: searchTerm, mode: "insensitive" } },
				{ area: { contains: searchTerm, mode: "insensitive" } },
				{ user: { name: { contains: searchTerm, mode: "insensitive" } } },
			],
		});
	}

	if (bloodGroup) andConditions.push({ bloodGroup });
	if (district)
		andConditions.push({ district: { equals: district, mode: "insensitive" } });
	if (area) andConditions.push({ area: { equals: area, mode: "insensitive" } });
	if (isAvailable !== undefined) {
		andConditions.push({ isAvailable: isAvailable === true });
	}

	const whereConditions: Prisma.DonorWhereInput =
		andConditions.length > 0 ? { AND: andConditions } : {};

	const result = await prisma.donor.findMany({
		where: whereConditions,
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					phoneNumber: true,
					imageUrl: true,
				},
			},
		},
	});

	return result;
};

const getMyDonorProfile = async (userId: string): Promise<Donor> => {
	const result = await prisma.donor.findUnique({
		where: { userId },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					phoneNumber: true,
					imageUrl: true,
				},
			},
		},
	});

	if (!result) {
		throw new AppError(404, "Donor profile not found");
	}

	return result;
};

const updateMyDonorProfile = async (
	userId: string,
	payload: IUpdateDonorProfileInput,
): Promise<Donor> => {
	const donor = await prisma.donor.findUnique({ where: { userId } });

	if (!donor) {
		throw new AppError(404, "Donor profile not found");
	}

	const result = await prisma.donor.update({
		where: { userId },
		data: {
			...payload,
			lastDonatedDate: payload.lastDonatedDate
				? new Date(payload.lastDonatedDate)
				: donor.lastDonatedDate,
		},
	});

	return result;
};

const updateDonorStatus = async (donorId: string, status: DonorStatus) => {
	const donor = await prisma.donor.findUnique({
		where: { id: donorId },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});

	if (!donor) {
		throw new AppError(404, "Donor request not found");
	}

	const result = await prisma.$transaction(async (tx) => {
		const updatedDonor = await tx.donor.update({
			where: { id: donorId },
			data: { status },
		});

		if (status === DonorStatus.APPROVED) {
			await tx.user.update({
				where: { id: donor.userId },
				data: { role: "DONOR" },
			});
		}

		return updatedDonor;
	});

	if (status === DonorStatus.APPROVED && donor.user?.email) {
		try {
			const templatePath = path.join(
				process.cwd(),
				"src/app/templates/donor-approved-email.ejs",
			);

			const templateData = {
				name: donor.user.name,
				loginUrl: `${config.frontend_url}/login`,
			};

			const html = await ejs.renderFile(templatePath, templateData);

			await transporter.sendMail({
				from: config.email_sender,
				to: donor.user.email,
				subject: "Your Blood Donor Application is Approved! 🩸",
				html,
			});
		} catch (error) {
			console.error("Failed to send donor approval email:", error);
		}
	}

	return result;
};

const getAllDonorApplications = async (status?: DonorStatus) => {
	const whereConditions: Prisma.DonorWhereInput = status ? { status } : {};

	const result = await prisma.donor.findMany({
		where: whereConditions,
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					phoneNumber: true,
					imageUrl: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return result;
};

export const DonorService = {
	applyForDonor,
	getAllDonors,
	getMyDonorProfile,
	updateMyDonorProfile,
	updateDonorStatus,
	getAllDonorApplications,
};
