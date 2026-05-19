/*
  Warnings:

  - You are about to drop the column `userId` on the `Wedding` table. All the data in the column will be lost.
  - Added the required column `createdById` to the `BudgetItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `BudgetItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `ChecklistTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ChecklistTask` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `Guest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PENDING', 'BRIDE', 'GROOM', 'FAMILY', 'OTHER');

-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('PRIVATE', 'SHARED');

-- DropForeignKey
ALTER TABLE "BudgetItem" DROP CONSTRAINT "BudgetItem_weddingId_fkey";

-- DropForeignKey
ALTER TABLE "ChecklistTask" DROP CONSTRAINT "ChecklistTask_weddingId_fkey";

-- DropForeignKey
ALTER TABLE "Guest" DROP CONSTRAINT "Guest_weddingId_fkey";

-- DropForeignKey
ALTER TABLE "Wedding" DROP CONSTRAINT "Wedding_userId_fkey";

-- DropIndex
DROP INDEX "Wedding_userId_idx";

-- AlterTable
ALTER TABLE "BudgetItem" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'SHARED';

-- AlterTable
ALTER TABLE "ChecklistTask" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'SHARED';

-- AlterTable
ALTER TABLE "Guest" ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedById" TEXT,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'SHARED';

-- AlterTable
ALTER TABLE "Wedding" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "WeddingMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'PENDING',
    "canEditCombinedView" BOOLEAN NOT NULL DEFAULT false,
    "canEditGuests" BOOLEAN NOT NULL DEFAULT false,
    "canManageBudget" BOOLEAN NOT NULL DEFAULT false,
    "canManageEvents" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeddingMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "details" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeddingMember_userId_idx" ON "WeddingMember"("userId");

-- CreateIndex
CREATE INDEX "WeddingMember_weddingId_idx" ON "WeddingMember"("weddingId");

-- CreateIndex
CREATE UNIQUE INDEX "WeddingMember_userId_weddingId_key" ON "WeddingMember"("userId", "weddingId");

-- CreateIndex
CREATE INDEX "ActivityLog_weddingId_idx" ON "ActivityLog"("weddingId");

-- CreateIndex
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

-- CreateIndex
CREATE INDEX "BudgetItem_weddingId_idx" ON "BudgetItem"("weddingId");

-- CreateIndex
CREATE INDEX "BudgetItem_createdById_idx" ON "BudgetItem"("createdById");

-- CreateIndex
CREATE INDEX "BudgetItem_updatedById_idx" ON "BudgetItem"("updatedById");

-- CreateIndex
CREATE INDEX "ChecklistTask_weddingId_idx" ON "ChecklistTask"("weddingId");

-- CreateIndex
CREATE INDEX "ChecklistTask_createdById_idx" ON "ChecklistTask"("createdById");

-- CreateIndex
CREATE INDEX "ChecklistTask_updatedById_idx" ON "ChecklistTask"("updatedById");

-- CreateIndex
CREATE INDEX "Guest_createdById_idx" ON "Guest"("createdById");

-- CreateIndex
CREATE INDEX "Guest_updatedById_idx" ON "Guest"("updatedById");

-- AddForeignKey
ALTER TABLE "WeddingMember" ADD CONSTRAINT "WeddingMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeddingMember" ADD CONSTRAINT "WeddingMember_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guest" ADD CONSTRAINT "Guest_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetItem" ADD CONSTRAINT "BudgetItem_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistTask" ADD CONSTRAINT "ChecklistTask_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistTask" ADD CONSTRAINT "ChecklistTask_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChecklistTask" ADD CONSTRAINT "ChecklistTask_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
