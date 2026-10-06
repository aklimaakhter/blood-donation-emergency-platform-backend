/*
  Warnings:

  - You are about to drop the column `gatewayResponse` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bloodRequestId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gatewayResponse",
ADD COLUMN     "bloodRequestId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "payments_bloodRequestId_key" ON "payments"("bloodRequestId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "blood_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;
