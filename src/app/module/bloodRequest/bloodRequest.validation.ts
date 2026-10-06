import { z } from 'zod';
import { BloodGroup, RequestStatus } from '../../../../generated/prisma/enums';

const createBloodRequestSchema = z.object({
  patientName: z.string('Patient name is required'),
    bloodGroup: z.nativeEnum(BloodGroup, 'Blood group is required'),
    hospitalName: z.string('Hospital name is required'),
    hospitalAddress: z.string('Hospital address is required'),
    district: z.string('District is required'),
    area: z.string('Area is required'),
    bagsNeeded: z.number().optional().default(1),
    dateOfDonation: z.string('Date of donation is required'),
    contactNumber: z.string('Contact number is required'),
    reason: z.string().optional(),
});

const updateBloodRequestStatusSchema = z.object({
  status: z.nativeEnum(RequestStatus, 'Status is required'),
});

export const BloodRequestValidation = {
  createBloodRequestSchema,
  updateBloodRequestStatusSchema,
};