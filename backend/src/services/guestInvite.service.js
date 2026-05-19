import crypto from 'crypto';
import { getPrisma } from '../loaders/database.js';
import { sendEmail } from './email.service.js';
import { invitationTemplate } from '../templates/invitation.template.js';

const generateToken = () => crypto.randomBytes(32).toString('hex');

export const sendTrackedInvite = async ({ weddingId, guestId, invitationId, appBaseUrl }) => {
    const prisma = getPrisma();

    const guest = await prisma.guest.findUnique({
        where: { id: guestId },
    });
    if (!guest || guest.weddingId !== weddingId) {
        const err = new Error('Guest not found in this workspace');
        err.statusCode = 404;
        throw err;
    }
    if (!guest.email) {
        const err = new Error('Guest email is required to send invite');
        err.statusCode = 400;
        throw err;
    }

    if (!invitationId) {
        const err = new Error('Specific invitation ID is required to send an invite');
        err.statusCode = 400;
        throw err;
    }

    const invitation = await prisma.invitation.findUnique({
        where: { id: invitationId },
        include: { event: { select: { name: true } } },
    });
    if (!invitation || invitation.weddingId !== weddingId) {
        const err = new Error('Invitation not found in this workspace');
        err.statusCode = 404;
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

    const safeEventName = invitation.event?.name
        ? invitation.event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        : 'all-events';

    const rsvpLink = `${appBaseUrl}/rsvp/${token}?event=${safeEventName}`;

    // Send email
    await sendEmail({
        to: guest.email,
        subject: invitation.title || 'You’re Invited!',
        html: invitationTemplate({
            name: guest.name,
            message: invitation.message,
            rsvpLink,
        }),
    });

    return guestInvite;
};

export const sendBulkInvites = async ({ weddingId, guestIds, invitationId, appBaseUrl }) => {
    const results = [];
    for (const guestId of guestIds) {
        try {
            const result = await sendTrackedInvite({
                weddingId,
                guestId,
                invitationId,
                appBaseUrl
            });
            results.push({ guestId, success: true, invite: result });
        } catch (error) {
            results.push({ guestId, success: false, error: error.message });
        }
    }
    return results;
};
