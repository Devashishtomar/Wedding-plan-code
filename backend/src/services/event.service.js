import { getPrisma } from '../loaders/database.js';

export const getEvents = async ({ visibilityFilter }) => {
    const prisma = getPrisma();
    return prisma.event.findMany({
        where: visibilityFilter,
        orderBy: { date: 'asc' }
    });
};

export const getEventById = async (id, weddingId) => {
    const prisma = getPrisma();
    const event = await prisma.event.findFirst({ where: { id, weddingId } });
    if (!event) {
        const err = new Error('Event not found');
        err.statusCode = 404;
        throw err;
    }
    return event;
};

export const addEvent = async ({ weddingId, userId, data }) => {
    const prisma = getPrisma();
    return prisma.event.create({
        data: {
            weddingId,
            createdById: userId,
            name: data.name,
            date: data.date ? new Date(data.date) : null,
            location: data.location,
            visibility: data.visibility,
            // Predefined events often have specific budget logic
            budget: data.budget || 0,
        }
    });
};

export const editEvent = async ({ weddingId, eventId, data }) => {
    const prisma = getPrisma();

    // Ensure existence in workspace
    await getEventById(eventId, weddingId);

    return prisma.event.update({
        where: { id: eventId },
        data: {
            name: data.name,
            date: data.date ? new Date(data.date) : undefined,
            location: data.location,
            visibility: data.visibility,
            budget: data.budget !== undefined ? Number(data.budget) : undefined
        }
    });
};

export const removeEvent = async (id, weddingId) => {
    const prisma = getPrisma();
    await getEventById(id, weddingId);

    return prisma.event.delete({ where: { id } });
};