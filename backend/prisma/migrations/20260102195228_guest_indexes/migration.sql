-- CreateIndex
CREATE INDEX "Guest_weddingId_idx" ON "Guest"("weddingId");

-- CreateIndex
CREATE INDEX "GuestInvite_guestId_idx" ON "GuestInvite"("guestId");

-- CreateIndex
CREATE INDEX "GuestInvite_invitationId_idx" ON "GuestInvite"("invitationId");
