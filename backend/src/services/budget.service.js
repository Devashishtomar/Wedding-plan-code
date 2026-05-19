import { getPrisma } from '../loaders/database.js';


export const listBudgetItems = async ({ visibilityFilter }) => {
    const prisma = getPrisma();

    return prisma.budgetItem.findMany({
        where: visibilityFilter,
        include: { event: { select: { name: true } } },
        orderBy: { createdAt: 'desc' },
    });
};

export const addBudgetItem = async ({ userId, weddingId, eventId, data }) => { // FIXED: Added eventId
    const prisma = getPrisma();

    return prisma.budgetItem.create({
        data: {
            weddingId,
            eventId: eventId || null,
            createdById: userId,
            visibility: data.visibility || 'SHARED',
            category: data.category,
            estimated: data.estimated,
            actual: data.actual || 0,
        },
    });
};

export const updateBudgetItem = async ({ userId, weddingId, itemId, data }) => {
    const prisma = getPrisma();

    const item = await prisma.budgetItem.findFirst({
        where: { id: itemId, weddingId },
    });

    if (!item) {
        const error = new Error('Budget item not found in this workspace');
        error.statusCode = 404;
        throw error;
    }

    return prisma.budgetItem.update({
        where: { id: itemId },
        data: {
            category: data.category !== undefined ? data.category : undefined,
            estimated: data.estimated !== undefined ? data.estimated : undefined,
            actual: data.actual !== undefined ? data.actual : undefined,
            visibility: data.visibility !== undefined ? data.visibility : undefined,
            eventId: data.eventId !== undefined ? data.eventId : undefined, // FIXED: Support event migration
            updatedById: userId,
        },
    });
};

export const deleteBudgetItem = async ({ weddingId, itemId }) => {
    const prisma = getPrisma();

    // Ensure item belongs to the workspace
    const item = await prisma.budgetItem.findFirst({
        where: { id: itemId, weddingId },
    });

    if (!item) {
        const error = new Error('Budget item not found in this workspace');
        error.statusCode = 404;
        throw error;
    }

    return prisma.budgetItem.delete({
        where: { id: itemId },
    });
};