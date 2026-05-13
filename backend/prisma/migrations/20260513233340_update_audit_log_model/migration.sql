/*
  Warnings:

  - You are about to drop the column `changedBy` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `newStatus` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `prescriptionId` on the `AuditLog` table. All the data in the column will be lost.
  - You are about to drop the column `previousStatus` on the `AuditLog` table. All the data in the column will be lost.
  - Added the required column `userId` to the `AuditLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AuditLog" DROP CONSTRAINT "AuditLog_prescriptionId_fkey";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "changedBy",
DROP COLUMN "newStatus",
DROP COLUMN "prescriptionId",
DROP COLUMN "previousStatus",
ADD COLUMN     "details" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
