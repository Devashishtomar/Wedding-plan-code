-- CreateEnum
CREATE TYPE "ArrangementType" AS ENUM ('SEATING', 'ROOMS');

-- CreateEnum
CREATE TYPE "TableShape" AS ENUM ('CIRCULAR', 'RECTANGULAR');

-- CreateTable
CREATE TABLE "Arrangement" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "eventId" TEXT,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'SHARED',
    "name" TEXT NOT NULL,
    "type" "ArrangementType" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Arrangement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatingTable" (
    "id" TEXT NOT NULL,
    "arrangementId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shape" "TableShape" NOT NULL DEFAULT 'CIRCULAR',
    "capacity" INTEGER NOT NULL DEFAULT 8,
    "category" TEXT,

    CONSTRAINT "SeatingTable_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeatAssignment" (
    "id" TEXT NOT NULL,
    "tableId" TEXT NOT NULL,
    "seatIndex" INTEGER NOT NULL,
    "guestId" TEXT NOT NULL,

    CONSTRAINT "SeatAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HotelRoom" (
    "id" TEXT NOT NULL,
    "arrangementId" TEXT NOT NULL,
    "roomNumber" TEXT NOT NULL,
    "familyName" TEXT,
    "capacity" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "HotelRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoomAssignment" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,

    CONSTRAINT "RoomAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Arrangement_weddingId_idx" ON "Arrangement"("weddingId");

-- CreateIndex
CREATE INDEX "Arrangement_eventId_idx" ON "Arrangement"("eventId");

-- CreateIndex
CREATE INDEX "Arrangement_createdById_idx" ON "Arrangement"("createdById");

-- CreateIndex
CREATE INDEX "Arrangement_updatedById_idx" ON "Arrangement"("updatedById");

-- CreateIndex
CREATE INDEX "SeatingTable_arrangementId_idx" ON "SeatingTable"("arrangementId");

-- CreateIndex
CREATE INDEX "SeatAssignment_tableId_idx" ON "SeatAssignment"("tableId");

-- CreateIndex
CREATE INDEX "SeatAssignment_guestId_idx" ON "SeatAssignment"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "SeatAssignment_tableId_seatIndex_key" ON "SeatAssignment"("tableId", "seatIndex");

-- CreateIndex
CREATE INDEX "HotelRoom_arrangementId_idx" ON "HotelRoom"("arrangementId");

-- CreateIndex
CREATE INDEX "RoomAssignment_roomId_idx" ON "RoomAssignment"("roomId");

-- CreateIndex
CREATE INDEX "RoomAssignment_guestId_idx" ON "RoomAssignment"("guestId");

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrangement" ADD CONSTRAINT "Arrangement_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatingTable" ADD CONSTRAINT "SeatingTable_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatAssignment" ADD CONSTRAINT "SeatAssignment_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "SeatingTable"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatAssignment" ADD CONSTRAINT "SeatAssignment_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HotelRoom" ADD CONSTRAINT "HotelRoom_arrangementId_fkey" FOREIGN KEY ("arrangementId") REFERENCES "Arrangement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomAssignment" ADD CONSTRAINT "RoomAssignment_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "HotelRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomAssignment" ADD CONSTRAINT "RoomAssignment_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
