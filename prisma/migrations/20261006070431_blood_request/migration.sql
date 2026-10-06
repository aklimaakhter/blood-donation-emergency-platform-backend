/*
  Warnings:

  - Added the required column `area` to the `blood_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `district` to the `blood_requests` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('HIGH', 'EMERGENCY', 'NORMAL');

-- AlterTable
ALTER TABLE "blood_requests" ADD COLUMN     "area" TEXT NOT NULL,
ADD COLUMN     "district" TEXT NOT NULL,
ADD COLUMN     "donorId" TEXT,
ADD COLUMN     "reason" TEXT,
ADD COLUMN     "urgency" "UrgencyLevel" NOT NULL DEFAULT 'NORMAL';

-- AddForeignKey
ALTER TABLE "blood_requests" ADD CONSTRAINT "blood_requests_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;
