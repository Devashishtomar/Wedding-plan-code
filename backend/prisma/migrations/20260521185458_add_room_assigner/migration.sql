-- AlterTable
ALTER TABLE "RoomAssignment" ADD COLUMN     "arrangementGuestId" TEXT,
ALTER COLUMN "guestId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "RoomAssignment_arrangementGuestId_idx" ON "RoomAssignment"("arrangementGuestId");

-- AddForeignKey
ALTER TABLE "RoomAssignment" ADD CONSTRAINT "RoomAssignment_arrangementGuestId_fkey" FOREIGN KEY ("arrangementGuestId") REFERENCES "ArrangementGuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
