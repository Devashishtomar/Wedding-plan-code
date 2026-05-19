-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "eventId" TEXT,
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'SHARED';

-- CreateIndex
CREATE INDEX "ActivityLog_eventId_idx" ON "ActivityLog"("eventId");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;
