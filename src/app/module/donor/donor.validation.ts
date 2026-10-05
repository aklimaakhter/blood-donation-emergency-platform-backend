
import { z } from 'zod';
import { BloodGroup } from '../../../../generated/prisma/enums';

const createDonorSchema = z.object({
  body: z.object({
    bloodGroup: z.nativeEnum(BloodGroup, 'Blood group is required'),
    district: z.string('District is required'),
    area: z.string('Area is required'),
    lastDonatedDate: z.string().optional(),
  }),
});

const updateDonorSchema = z.object({
  body: z.object({
    bloodGroup: z.nativeEnum(BloodGroup).optional(),
    district: z.string().optional(),
    area: z.string().optional(),
    isAvailable: z.boolean().optional(),
    lastDonatedDate: z.string().optional(),
  }),
});

export const DonorValidation = {
  createDonorSchema,
  updateDonorSchema,
};