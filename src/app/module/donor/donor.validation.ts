import { z } from "zod";
import { BloodGroup, DonorStatus } from "../../../../generated/prisma/enums";

const createDonorSchema = z.object({
	bloodGroup: z.nativeEnum(BloodGroup, { message: "Blood group is required" }),
	district: z.string({ message: "District is required" }),
	area: z.string({ message: "Area is required" }),
	lastDonatedDate: z.string().optional(),
});

const updateDonorSchema = z.object({
	bloodGroup: z.nativeEnum(BloodGroup).optional(),
	district: z.string().optional(),
	area: z.string().optional(),
	isAvailable: z.boolean().optional(),
	lastDonatedDate: z.string().optional(),
});

const updateDonorStatusSchema = z.object({
	status: z.nativeEnum(DonorStatus, {
		message: "Status is required (APPROVED or REJECTED)",
	}),
});

export const DonorValidation = {
	createDonorSchema,
	updateDonorSchema,
	updateDonorStatusSchema,
};
