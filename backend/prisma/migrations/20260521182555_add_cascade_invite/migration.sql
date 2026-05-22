-- DropForeignKey
ALTER TABLE "GuestInvite" DROP CONSTRAINT "GuestInvite_guestId_fkey";

-- DropForeignKey
ALTER TABLE "GuestInvite" DROP CONSTRAINT "GuestInvite_invitationId_fkey";

-- AddForeignKey
ALTER TABLE "GuestInvite" ADD CONSTRAINT "GuestInvite_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestInvite" ADD CONSTRAINT "GuestInvite_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
