-- AlterTable
ALTER TABLE "SeatAssignment" ADD COLUMN     "arrangementGuestId" TEXT,
ALTER COLUMN "guestId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ArrangementGuest" (
    "id" TEXT NOT NULL,
    "arrangementId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArrangementGuest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArrangementGuest_arrangementId_idx" ON "ArrangementGuest"("arrangementId");

-- CreateIndex
CREATE INDEX "SeatAssignment_arrangementGuestId_idx" ON "SeatAssignment"("arrangementGuestId");

-- AddForeignKey
ALTER TABLE "SeatAssignment" ADD CONSTRAINT "SeatAssignment_arrangementGuestId_fkey" FOREIGN KEY ("arrangementGuestId") REFERENCES "ArrangementGuest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrangementGuest" ADD CONSTRAINT "ArrangementGuest_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;
