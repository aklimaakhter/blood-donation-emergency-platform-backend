import z from "zod";

const UserRegistrationZodSchema = z.object({
	name: z.string().min(1, { message: "Name is required" }),
	email: z.email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.regex(/[A-Z]/, {
			message: "Password must contain at least one uppercase letter",
		})
		.regex(/[a-z]/, {
			message: "Password must contain at least one lowercase letter",
		})
		.regex(/[0-9]/, { message: "Password must contain at least one number" })
		.regex(/[^A-Za-z0-9]/, {
			message: "Password must contain at least one special character",
		})
	
});

const UserVerifyEmailZodSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	otp: z.string().length(6, { message: "OTP must be exactly 6 digits" }),
});

const UserLoginZodSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	password: z.string().min(1, { message: "Password is required" }),
});

const GoogleLoginZodSchema = z.object({
	idToken: z.string().min(1, { message: "Google ID Token is required" }),
});

const ForgotPasswordZodSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
});

const ResetPasswordZodSchema = z.object({
	email: z.email({ message: "Invalid email address" }),
	newPassword: z
		.string()
		.min(8, { message: "Password must be at least 8 characters long" })
		.regex(/[A-Z]/, {
			message: "Password must contain at least one uppercase letter",
		})
		.regex(/[a-z]/, {
			message: "Password must contain at least one lowercase letter",
		})
		.regex(/[0-9]/, { message: "Password must contain at least one number" })
		.regex(/[^A-Za-z0-9]/, {
			message: "Password must contain at least one special character",
		}),
	otp: z.string().length(6, { message: "OTP must be exactly 6 digits" }),
});

export const userValidation = {
	UserRegistrationZodSchema,
	UserVerifyEmailZodSchema,
	UserLoginZodSchema,
	GoogleLoginZodSchema,
	ForgotPasswordZodSchema,
	ResetPasswordZodSchema,
};
