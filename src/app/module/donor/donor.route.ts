import express from 'express';
import { DonorController } from './donor.controller';
import { DonorValidation } from './donor.validation';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validationRequest';
import { Role } from '../../../../generated/prisma/enums';

const router = express.Router();

router.get('/', DonorController.getAllDonors);

router.post(
  '/apply',
  auth(Role.USER, Role.DONOR),
  validateRequest(DonorValidation.createDonorSchema),
  DonorController.applyForDonor
);

router.get(
  '/me',
  auth(Role.USER, Role.DONOR, Role.ADMIN),
  DonorController.getMyDonorProfile
);


router.patch(
  '/me',
  auth(Role.DONOR),
  validateRequest(DonorValidation.updateDonorSchema),
  DonorController.updateMyDonorProfile
);


router.get(
  '/applications',
  auth(Role.ADMIN),
  DonorController.getAllDonorApplications
);


router.patch(
  '/:id/status',
  auth(Role.ADMIN),
  validateRequest(DonorValidation.updateDonorStatusSchema),
  DonorController.updateDonorStatus
);

export const DonorRoutes = router;