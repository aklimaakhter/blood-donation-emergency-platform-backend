import type { BloodGroup, RequestStatus } from "../../../../generated/prisma/enums";

export type IBloodRequestFilterRequest = {
	searchTerm?: string;
	bloodGroup?: BloodGroup;
	district?: string;
	area?: string;
	status?: RequestStatus;
};

export type ICreateBloodRequestInput = {
	patientName: string;
	bloodGroup: BloodGroup;
	hospitalName: string;
	hospitalAddress: string;
	district: string;
	area: string;
	bagsNeeded?: number;
	dateOfDonation: string | Date;
	contactNumber: string;
	reason?: string;
};

export type IUpdateBloodRequestInput = Partial<ICreateBloodRequestInput> & {
	status?: RequestStatus;
};
