import { getPrisma } from '../loaders/database.js';

/**
 * Verify wedding ownership
 */
const verifyWeddingOwnership = async (userId, weddingId) => {
    const prisma = getPrisma();

    const wedding = await prisma.wedding.findFirst({
        where: { id: weddingId, userId },
    });

    if (!wedding) {
        const error = new Error('Wedding not found');
        error.statusCode = 404;
        throw error;
    }

    return wedding;
};

/**
 * Add budget item
 */
export const addBudgetItem = async ({ userId, weddingId, data }) => {
    const prisma = getPrisma();
    await verifyWeddingOwnership(userId, weddingId);

    return prisma.budgetItem.create({
        data: {
            weddingId,
            category: data.category,
            estimated: data.estimated,
            actual: data.actual || 0,
        },
    });
};

/**
 * List budget items
 */
export const listBudgetItems = async ({ userId, weddingId }) => {
    const prisma = getPrisma();
    await verifyWeddingOwnership(userId, weddingId);

    return prisma.budgetItem.findMany({
        where: { weddingId },
        orderBy: { createdAt: 'desc' },
    });
};

/**
 * Update budget item
 */
export const updateBudgetItem = async ({ userId, itemId, data }) => {
    const prisma = getPrisma();
    const item = await prisma.budgetItem.findUnique({
        where: { id: itemId },
        include: { wedding: true },
    });

    if (!item || item.wedding.userId !== userId) {
        const error = new Error('Budget item not found');
        error.statusCode = 404;
        throw error;
    }

    return prisma.budgetItem.update({
        where: { id: itemId },
        data: {
            category: data.category,
            estimated: data.estimated,
            actual: data.actual,
        },
    });
};

/**
 * Delete budget item
 */
export const deleteBudgetItem = async ({ userId, itemId }) => {
    const prisma = getPrisma();
    const item = await prisma.budgetItem.findUnique({
        where: { id: itemId },
        include: { wedding: true },
    });

    if (!item || item.wedding.userId !== userId) {
        const error = new Error('Budget item not found');
        error.statusCode = 404;
        throw error;
    }

    await prisma.budgetItem.delete({
        where: { id: itemId },
    });
};
