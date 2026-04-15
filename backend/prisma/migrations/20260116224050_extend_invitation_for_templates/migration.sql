-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "date" TEXT,
ADD COLUMN     "globalFontFamily" TEXT,
ADD COLUMN     "names" TEXT,
ADD COLUMN     "rsvpDate" TEXT,
ADD COLUMN     "styles" JSONB,
ADD COLUMN     "templateId" TEXT,
ADD COLUMN     "time" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "venue" TEXT;

-- AddForeignKey
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
