/*
  Warnings:

  - You are about to drop the column `email` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `respondedAt` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `Invitation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Invitation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[weddingId]` on the table `Invitation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `message` to the `Invitation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Invitation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invitation" DROP COLUMN "email",
DROP COLUMN "expiresAt",
DROP COLUMN "respondedAt",
DROP COLUMN "sentAt",
DROP COLUMN "status",
ADD COLUMN     "message" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invitation_weddingId_key" ON "Invitation"("weddingId");
