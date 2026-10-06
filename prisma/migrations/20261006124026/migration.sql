/*
  Warnings:

  - You are about to drop the column `gateway` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `transactionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `payments` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `payments` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.
  - A unique constraint covering the columns `[merchantInvoiceNumber]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bkashPaymentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `merchantInvoiceNumber` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_userId_fkey";

-- DropIndex
DROP INDEX "payments_transactionId_key";

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gateway",
DROP COLUMN "transactionId",
DROP COLUMN "userId",
ADD COLUMN     "bkashPaymentId" TEXT,
ADD COLUMN     "bkashTrxId" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'BDT',
ADD COLUMN     "gatewayResponse" JSONB,
ADD COLUMN     "merchantInvoiceNumber" TEXT NOT NULL,
ADD COLUMN     "paidAt" TEXT,
ADD COLUMN     "payerReference" TEXT,
ADD COLUMN     "paymentGateway" TEXT NOT NULL DEFAULT 'bkash',
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(10,2);

-- CreateIndex
CREATE UNIQUE INDEX "payments_merchantInvoiceNumber_key" ON "payments"("merchantInvoiceNumber");

-- CreateIndex
CREATE UNIQUE INDEX "payments_bkashPaymentId_key" ON "payments"("bkashPaymentId");
