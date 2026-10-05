-- CreateEnum
CREATE TYPE "DonorStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "donors" ADD COLUMN     "status" "DonorStatus" NOT NULL DEFAULT 'PENDING';
