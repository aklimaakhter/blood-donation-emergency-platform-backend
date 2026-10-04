import app from "./app";
import { prisma } from "./app/lib/prisma";
import config from "./app/config";
import { seedTesterAdmin } from "./app/utils/seed";
import { redisClient } from "./app/lib/redis";
import { transporter } from "./app/lib/nodemailer";

const PORT = config.port;

async function main() {
	try {
		await prisma.$connect();
		console.log("Connected to the database successfully.");

		await redisClient.connect();
		console.log("Redis connected successfully.");

		await transporter.verify();
		console.log("Nodemailer connected successfully.");

		await seedTesterAdmin();

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error starting the server:", error);
		await prisma.$disconnect();
		process.exit(1);
	}
}

main();
