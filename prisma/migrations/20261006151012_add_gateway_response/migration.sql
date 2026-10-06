-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_bloodRequestId_fkey";

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "gatewayResponse" JSONB;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "blood_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
