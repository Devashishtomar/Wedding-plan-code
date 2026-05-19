-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "budget" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Wedding" ADD COLUMN     "suggestedVendorNote" TEXT,
ADD COLUMN     "suggestedVenueName" TEXT;
