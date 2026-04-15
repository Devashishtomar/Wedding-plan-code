import { getPrisma } from '../loaders/database.js';

export const submitRSVP = async ({ token, name, response }) => {
    const prisma = getPrisma();

    const invitation = await prisma.invitation.findUnique({
        where: { token },
    });

    if (!invitation) {
        const err = new Error('Invalid invitation');
        err.statusCode = 404;
        throw err;
    }

    const weddingId = invitation.weddingId;

    return prisma.guest.create({
        data: {
            weddingId,
            name,
            email: null, // explicit public response
            rsvp: response === 'yes' ? 'ACCEPTED' : 'DECLINED',
        },
    });
};

export const submitTrackedRSVP = async ({ token, response }) => {
    const prisma = getPrisma();

    const guestInvite = await prisma.guestInvite.findUnique({
        where: { token },
        include: { guest: true },
    });
    if (!guestInvite) {
        const err = new Error('Invalid invite');
        err.statusCode = 404;
        throw err;
    }

    const rsvpValue = response === 'yes' ? 'ACCEPTED' : 'DECLINED';

    await prisma.$transaction([
        prisma.guest.update({
            where: { id: guestInvite.guestId },
            data: { rsvp: rsvpValue },
        }),
        prisma.guestInvite.update({
            where: { id: guestInvite.id },
            data: {
                status: rsvpValue,
                respondedAt: new Date(),
            },
        }),
    ]);
};


export const resolveRSVPToken = async ({ token }) => {
    const prisma = getPrisma();

    // 1. Check tracked invite first
    const guestInvite = await prisma.guestInvite.findUnique({
        where: { token },
        include: {
            guest: true,
            invitation: {
                include: {
                    wedding: {
                        select: {
                            date: true,
                            location: true,
                        },
                    },
                },
            },
        },
    });

    if (guestInvite) {
        return {
            mode: 'private',
            guest: {
                name: guestInvite.guest.name,
            },
            invitation: {
                invitationId: guestInvite.invitation.id,
                message: guestInvite.invitation.message,
                wedding: guestInvite.invitation.wedding,
            },
            alreadyResponded: !!guestInvite.respondedAt,
        };
    }

    // 2. Check public invitation
    const invitation = await prisma.invitation.findUnique({
        where: { token },
        include: {
            wedding: {
                select: {
                    date: true,
                    location: true,
                },
            },
        },
    });

    if (invitation) {
        return {
            mode: 'public',
            invitation: {
                invitationId: invitation.id,
                message: invitation.message,
                wedding: invitation.wedding,
            },
        };
    }

    const err = new Error('Invalid RSVP link');
    err.statusCode = 404;
    throw err;
};
