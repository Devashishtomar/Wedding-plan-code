import { getPrisma } from '../loaders/database.js';


export const listGuests = async ({ userId }) => {
    const prisma = getPrisma();

    const wedding = await prisma.wedding.findFirst({
        where: { userId },
    });

    if (!wedding) {
        const error = new Error('Wedding not found');
        error.statusCode = 404;
        throw error;
    }

    return prisma.guest.findMany({
        where: { weddingId: wedding.id },
        include: {
            invites: true, // GuestInvite[]
        },
        orderBy: { createdAt: 'asc' },
    });
};


export const createGuest = async ({ userId, name, email }) => {
    const prisma = getPrisma();

    const wedding = await prisma.wedding.findFirst({
        where: { userId },
    });

    if (!wedding) {
        const error = new Error('Wedding not found');
        error.statusCode = 404;
        throw error;
    }

    return prisma.guest.create({
        data: {
            weddingId: wedding.id,
            name,
            email: email || null,
        },
    });
};



export const updateGuest = async ({ userId, guestId, name, email }) => {
    const prisma = getPrisma();

    const wedding = await prisma.wedding.findFirst({
        where: { userId },
    });
    if (!wedding) {
        const err = new Error("Wedding not found");
        err.statusCode = 404;
        throw err;
    }

    // Resolve guest
    const guest = await prisma.guest.findUnique({
        where: { id: guestId },
        include: { invites: true },
    });

    if (!guest || guest.weddingId !== wedding.id) {
        const err = new Error("Guest not found");
        err.statusCode = 404;
        throw err;
    }

    if (guest.invites.length > 0) {
        const err = new Error(
            "Cannot edit guest after invitation is sent"
        );
        err.statusCode = 400;
        throw err;
    }

    const updatedGuest = await prisma.guest.update({
        where: { id: guest.id },
        data: {
            name,
            email,
        },
    });

    return updatedGuest;
};


export const deleteGuest = async ({ userId, guestId }) => {
    const prisma = getPrisma();

    const wedding = await prisma.wedding.findFirst({
        where: { userId },
    });
    if (!wedding) {
        const err = new Error('Wedding not found');
        err.statusCode = 404;
        throw err;
    }

    const guest = await prisma.guest.findUnique({
        where: { id: guestId },
        include: {
            invites: true,
        },
    });

    if (!guest || guest.weddingId !== wedding.id) {
        const err = new Error('Guest not found');
        err.statusCode = 404;
        throw err;
    }

    if (guest.invites.length > 0) {
        const err = new Error(
            'Cannot delete guest after invitation is sent'
        );
        err.statusCode = 400;
        throw err;
    }

    if (guest.rsvp === 'ACCEPTED') {
        const err = new Error(
            'Cannot delete guest who has accepted the invitation'
        );
        err.statusCode = 400;
        throw err;
    }

    await prisma.guest.delete({
        where: { id: guest.id },
    });

    return true;
};
