import { Donor, DonorStatus, Prisma } from '../../../../generated/prisma/browser';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../utils/AppError';
import { ICreateDonorInput, IDonorFilterRequest, IUpdateDonorProfileInput } from './donor.interface';

// 1. User applies to become a Donor
const applyForDonor = async (
  userId: string,
  payload: ICreateDonorInput
): Promise<Donor> => {
  const existingDonor = await prisma.donor.findUnique({
    where: { userId },
  });

  if (existingDonor) {
    throw new AppError(400, 'You have already applied or registered as a donor');
  }

  const result = await prisma.donor.create({
    data: {
      userId,
      bloodGroup: payload.bloodGroup,
      district: payload.district,
      area: payload.area,
      lastDonatedDate: payload.lastDonatedDate ? new Date(payload.lastDonatedDate) : null,
      status: DonorStatus.PENDING,
    },
  });

  return result;
};

// 2. Public Search for Approved Donors
const getAllDonors = async (filters: IDonorFilterRequest) => {
  const { searchTerm, bloodGroup, district, area, isAvailable } = filters;
  const andConditions: Prisma.DonorWhereInput[] = [
    { status: DonorStatus.APPROVED }, // Only show approved donors publicly
  ];

  if (searchTerm) {
    andConditions.push({
      OR: [
        { district: { contains: searchTerm, mode: 'insensitive' } },
        { area: { contains: searchTerm, mode: 'insensitive' } },
        { user: { name: { contains: searchTerm, mode: 'insensitive' } } },
      ],
    });
  }

  if (bloodGroup) andConditions.push({ bloodGroup });
  if (district) andConditions.push({ district: { equals: district, mode: 'insensitive' } });
  if (area) andConditions.push({ area: { equals: area, mode: 'insensitive' } });
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

// 3. Get Logged-in Donor Profile
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
    throw new AppError(404, 'Donor profile not found');
  }

  return result;
};

// 4. Update Logged-in Donor Profile
const updateMyDonorProfile = async (
  userId: string,
  payload: IUpdateDonorProfileInput
): Promise<Donor> => {
  const donor = await prisma.donor.findUnique({ where: { userId } });

  if (!donor) {
    throw new AppError(404, 'Donor profile not found');
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

// 5. Admin: Approve or Reject Donor Request
const updateDonorStatus = async (donorId: string, status: DonorStatus) => {
  const donor = await prisma.donor.findUnique({
    where: { id: donorId },
  });

  if (!donor) {
    throw new AppError(404, 'Donor request not found');
  }

  // Use transaction to update status & upgrade user role to DONOR if approved
  const result = await prisma.$transaction(async (tx) => {
    const updatedDonor = await tx.donor.update({
      where: { id: donorId },
      data: { status },
    });

    if (status === DonorStatus.APPROVED) {
      await tx.user.update({
        where: { id: donor.userId },
        data: { role: 'DONOR' },
      });
    }

    return updatedDonor;
  });

  return result;
};

// 6. Admin: Get All Donor Applications (Pending, Approved, Rejected)
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
      createdAt: 'desc',
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