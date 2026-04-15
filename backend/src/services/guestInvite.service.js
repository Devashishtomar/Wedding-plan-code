import crypto from 'crypto';
import { getPrisma } from '../loaders/database.js';
import { sendEmail } from './email.service.js';
import { invitationTemplate } from '../templates/invitation.template.js';

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const sendTrackedInvite = async ({ userId, guestId, appBaseUrl }) => {
    const prisma = getPrisma();

    // Resolve wedding
    const wedding = await prisma.wedding.findFirst({
        where: { userId },
    });
    if (!wedding) {
        const err = new Error('Wedding not found');
        err.statusCode = 404;
        throw err;
    }

    // Resolve guest
    const guest = await prisma.guest.findUnique({
        where: { id: guestId },
    });
    if (!guest || guest.weddingId !== wedding.id) {
        const err = new Error('Guest not found');
        err.statusCode = 404;
        throw err;
    }
    if (!guest.email) {
        const err = new Error('Guest email is required to send invite');
        err.statusCode = 400;
        throw err;
    }

    // Resolve canonical invitation
    const invitation = await prisma.invitation.findUnique({
        where: { weddingId: wedding.id },
    });
    if (!invitation) {
        const err = new Error('Create invitation before sending invites');
        err.statusCode = 400;
        throw err;
    }

    // Create GuestInvite (tracked)
    const token = generateToken();
    const guestInvite = await prisma.guestInvite.create({
        data: {
            guestId: guest.id,
            invitationId: invitation.id,
            token,
            status: 'SENT',
            sentAt: new Date(),
        },
    });

    // Build RSVP link (same page, private mode)
    const rsvpLink = `${appBaseUrl}/rsvp/${token}`;

    // Send email
    await sendEmail({
        to: guest.email,
        subject: 'You’re Invited!',
        html: invitationTemplate({
            name: guest.name,
            message: invitation.message,
            rsvpLink,
        }),
    });

    return guestInvite;
};
