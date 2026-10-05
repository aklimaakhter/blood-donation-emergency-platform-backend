import { BloodGroup } from "../../../../generated/prisma/enums";


export type IDonorFilterRequest = {
  searchTerm?: string;
  bloodGroup?: BloodGroup;
  district?: string;
  area?: string;
  isAvailable?: boolean;
};

export type ICreateDonorInput = {
  bloodGroup: BloodGroup;
  district: string;
  area: string;
  lastDonatedDate?: Date;
};

export type IUpdateDonorProfileInput = Partial<ICreateDonorInput> & {
  isAvailable?: boolean;
};