import app from "./app.js";
import { prisma } from "./app/lib/prisma";
import { redisClient } from "./app/lib/redis";
import { seedTesterAdmin } from "./app/utils/seed";

let ready: Promise<void> | null = null;

function init() {
  if (!ready) {
    ready = (async () => {
      await prisma.$connect();
      if (!redisClient.isOpen) await redisClient.connect();
      await seedTesterAdmin();
    })().catch((err) => {
      ready = null; // porer request-e abar try korbe
      throw err;
    });
  }
  return ready;
}

export default async function handler(req: any, res: any) {
  await init();
  return app(req, res);
}