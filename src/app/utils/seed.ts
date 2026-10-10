import bcrypt from "bcryptjs";
import {
	AuthProvider,
	Role,
	UserStatus,
} from "../../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";

interface ISeedUser {
	label: string;
	name?: string;
	email?: string;
	password?: string;
	role: Role;
}

const seedUser = async ({ label, name, email, password, role }: ISeedUser) => {
	try {
		if (!name || !email || !password) {
			throw new Error(`${label}: name, email or password missing in env file`);
		}

		const exists = await prisma.user.findUnique({ where: { email } });

		if (exists) {
			console.log(`${label} already exists.`);
			return;
		}

		const hashedPassword = await bcrypt.hash(
			password,
			Number(config.bcrypt_salt_rounds) || 10,
		);

		await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
				role,
				status: UserStatus.ACTIVE,
				needPasswordChange: false,
				emailVerified: true,
				authProvider: AuthProvider.CREDENTIAL,
			},
		});

		console.log(`${label} created: ${email}`);
	} catch (error) {
		console.log(`Error seeding ${label}: `, error);
	}
};

export const seedTesterAdmin = () =>
	seedUser({
		label: "Tester Admin",
		name: config.tester_admin_name,
		email: config.tester_admin_email,
		password: config.tester_admin_password,
		role: Role.ADMIN,
	});

export const seedTesterDonor = () =>
	seedUser({
		label: "Tester Donor",
		name: config.tester_donor_name,
		email: config.tester_donor_email,
		password: config.tester_donor_password,
		role: Role.DONOR,
	});

export const seedTesterUser = () =>
	seedUser({
		label: "Tester User",
		name: config.tester_user_name,
		email: config.tester_user_email,
		password: config.tester_user_password,
		role: Role.USER,
	});