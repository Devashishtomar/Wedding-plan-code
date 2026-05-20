-- CreateTable
CREATE TABLE "PinnedInspiration" (
    "id" TEXT NOT NULL,
    "weddingId" TEXT NOT NULL,
    "eventId" TEXT,
    "createdById" TEXT NOT NULL,
    "updatedById" TEXT,
    "visibility" "Visibility" NOT NULL DEFAULT 'SHARED',
    "imageUrl" TEXT NOT NULL,
    "title" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PinnedInspiration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PinnedInspiration_weddingId_idx" ON "PinnedInspiration"("weddingId");

-- CreateIndex
CREATE INDEX "PinnedInspiration_eventId_idx" ON "PinnedInspiration"("eventId");

-- CreateIndex
CREATE INDEX "PinnedInspiration_createdById_idx" ON "PinnedInspiration"("createdById");

-- CreateIndex
CREATE INDEX "PinnedInspiration_updatedById_idx" ON "PinnedInspiration"("updatedById");

-- AddForeignKey
ALTER TABLE "PinnedInspiration" ADD CONSTRAINT "PinnedInspiration_weddingId_fkey" FOREIGN KEY ("weddingId") REFERENCES "Wedding"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedInspiration" ADD CONSTRAINT "PinnedInspiration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedInspiration" ADD CONSTRAINT "PinnedInspiration_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinnedInspiration" ADD CONSTRAINT "PinnedInspiration_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
