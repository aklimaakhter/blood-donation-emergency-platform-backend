import { z } from 'zod';
import { BloodGroup, RequestStatus } from '../../../../generated/prisma/enums';

const createBloodRequestSchema = z.object({
  patientName: z.string({message:'Patient name is required'}),
    bloodGroup: z.nativeEnum(BloodGroup, {message:'Blood group is required'}),
    hospitalName: z.string({message:'Hospital name is required'}),
    hospitalAddress: z.string({message:'Hospital address is required'}),
    district: z.string({message:'District is required'}),
    area: z.string({message:'Area is required'}),
    bagsNeeded: z.number().optional().default(1),
    dateOfDonation: z.string({message:'Date of donation is required'}),
    contactNumber: z.string({message:'Contact number is required'}),
    reason: z.string().optional(),
});

const updateBloodRequestStatusSchema = z.object({
  status: z.nativeEnum(RequestStatus, {message:'Status is required'}),
});

export const BloodRequestValidation = {
  createBloodRequestSchema,
  updateBloodRequestStatusSchema,
};