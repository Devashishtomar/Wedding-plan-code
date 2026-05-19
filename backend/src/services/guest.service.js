import { getPrisma } from '../loaders/database.js';

export const listGuests = async ({ visibilityFilter }) => {
    const prisma = getPrisma();

    return prisma.guest.findMany({
        where: visibilityFilter,
        include: {
            invites: true,
            event: { select: { name: true } }
        },
        orderBy: { createdAt: 'asc' },
    });
};

export const createGuest = async ({ weddingId, eventId, userId, name, email, visibility }) => {
    const prisma = getPrisma();

    return prisma.guest.create({
        data: {
            weddingId,
            eventId: eventId || null,
            createdById: userId,
            visibility,
            name,
            email: email || null,
        },
    });
};

export const updateGuest = async ({ weddingId, eventId, userId, guestId, name, email, visibility }) => {
    const prisma = getPrisma();

    const guest = await prisma.guest.findUnique({
        where: { id: guestId },
        include: { invites: true },
    });

    if (!guest || guest.weddingId !== weddingId) {
        const err = new Error('Guest not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    if (guest.invites.length > 0) {
        const err = new Error("Cannot edit guest after invitation is sent");
        err.statusCode = 400;
        throw err;
    }

    return prisma.guest.update({
        where: { id: guestId },
        data: {
            eventId: eventId !== undefined ? (eventId || null) : undefined,
            name: name !== undefined ? name : undefined,
            email: email !== undefined ? email : undefined,
            visibility: visibility !== undefined ? visibility : undefined, // Pillar 3 Isolation
            updatedById: userId, // Track responsibility for the move
        },
    });
};

export const deleteGuest = async ({ weddingId, guestId }) => {
    const prisma = getPrisma();

    const guest = await prisma.guest.findUnique({
        where: { id: guestId },
        include: { invites: true },
    });

    if (!guest || guest.weddingId !== weddingId) {
        const err = new Error('Guest not found in this workspace');
        err.statusCode = 404;
        throw err;
    }

    if (guest.invites.length > 0) {
        const err = new Error('Cannot delete guest after invitation is sent');
        err.statusCode = 400;
        throw err;
    }

    return prisma.guest.delete({
        where: { id: guestId },
    });
};


export const createGuestsBulk = async ({ weddingId, userId, guests, eventId, visibility }) => {
    const prisma = getPrisma();

    const guestData = guests.map(guest => ({
        weddingId,
        eventId: eventId === 'all' ? null : (eventId || null),
        visibility: visibility || 'SHARED',
        createdById: userId,
        name: guest.name,
        email: guest.email || null,
    }));

    const result = await prisma.guest.createMany({
        data: guestData,
        skipDuplicates: true,
    });

    return result;
};
