import { getPrisma } from '../loaders/database.js';

export const getMyWedding = async (weddingId) => {
    const prisma = getPrisma();
    return prisma.wedding.findUnique({
        where: { id: weddingId },
        include: {
            // We now fetch the workspace members instead of just guests
            members: {
                include: {
                    user: { select: { id: true, name: true, email: true } }
                }
            }
        },
    });
};

export const setupWeddingService = async ({ weddingId, userId, data }) => {
    const prisma = getPrisma();
    const { role, ...weddingData } = data;

    // FIXED: Use a transaction to securely update the workspace AND elevate the creator
    return prisma.$transaction(async (tx) => {
        const wedding = await tx.wedding.update({
            where: { id: weddingId },
            data: {
                ...weddingData,
                setupCompleted: true,
            }
        });

        // FIXED: Elevate the creator to their chosen role and grant Master Admin permissions
        if (role) {
            await tx.weddingMember.update({
                where: {
                    userId_weddingId: {
                        userId: userId,
                        weddingId: weddingId,
                    }
                },
                data: {
                    role: role,
                    side: role,
                    canViewPrivate: true,
                    canEditPrivate: true,
                    canEditCombinedView: true,
                    canEditGuests: true,
                    canManageBudget: true,
                    canManageEvents: true
                }
            });
        }

        return wedding;
    });
};

export const getWeddingMembers = async (weddingId) => {
    const prisma = getPrisma();
    return prisma.weddingMember.findMany({
        where: { weddingId },
        include: {
            user: { select: { id: true, name: true, email: true } }
        },
        orderBy: { createdAt: 'asc' }
    });
};

export const updateWeddingMember = async ({ weddingId, memberId, role, side, permissions }) => {
    const prisma = getPrisma();

    const member = await prisma.weddingMember.findFirst({
        where: { id: memberId, weddingId }
    });

    if (!member) {
        const error = new Error('Team member not found in this workspace');
        error.statusCode = 404;
        throw error;
    }

    const isCouple = role === 'BRIDE' || role === 'GROOM';
    const memberSide = isCouple ? role : (side !== undefined ? side : member.side);

    const cleanDbRole = ['BRIDE', 'GROOM', 'FAMILY', 'OTHER', 'PENDING'].includes(role) ? role : 'OTHER';

    return prisma.weddingMember.update({
        where: { id: memberId },
        data: {
            role: cleanDbRole,
            side: memberSide,
            canViewPrivate: isCouple ? true : (permissions?.canViewPrivate ?? member.canViewPrivate),
            canEditPrivate: isCouple ? true : (permissions?.canEditPrivate ?? member.canEditPrivate),
            canEditCombinedView: isCouple ? true : (permissions?.canEditCombinedView ?? member.canEditCombinedView),
            canEditGuests: isCouple ? true : (permissions?.canEditGuests ?? member.canEditGuests),
            canManageBudget: isCouple ? true : (permissions?.canManageBudget ?? member.canManageBudget),
            canManageEvents: isCouple ? true : (permissions?.canManageEvents ?? member.canManageEvents),
        },
        include: { user: { select: { id: true, name: true, email: true } } }
    });
};

export const removeWeddingMember = async ({ weddingId, memberId }) => {
    const prisma = getPrisma();

    const member = await prisma.weddingMember.findFirst({
        where: { id: memberId, weddingId }
    });

    if (!member) {
        const error = new Error('Team member not found in this workspace');
        error.statusCode = 404;
        throw error;
    }

    return prisma.weddingMember.delete({
        where: { id: memberId }
    });
};


export const acceptSuggestionService = async ({ weddingId, userId, suggestion }) => { // FIXED: Accept weddingId directly
    const prisma = getPrisma();

    return await prisma.$transaction(async (tx) => {
        // 1. Clear existing items
        await tx.budgetItem.deleteMany({ where: { weddingId } });
        await tx.checklistTask.deleteMany({ where: { weddingId } });

        // 2. Create Budget Items in bulk
        await tx.budgetItem.createMany({
            data: suggestion.budgetAllocation.map((item) => ({
                weddingId,
                eventId: null,
                visibility: 'SHARED',
                createdById: userId,
                category: item.category,
                estimated: item.estimated,
                actual: 0,
            })),
        });

        // 3. Create Checklist Tasks in bulk
        await tx.checklistTask.createMany({
            data: suggestion.checklist.map((task) => ({
                weddingId,
                eventId: null,
                visibility: 'SHARED',
                createdById: userId,
                title: task.title,
                category: task.category,
                priority: task.priority || 'MEDIUM',
                dueDate: task.dueDate ? new Date(task.dueDate) : null,
            })),
        });

        // 4. Update Wedding Suggestions
        await tx.wedding.update({
            where: { id: weddingId },
            data: {
                suggestedVenueName: suggestion.suggestions.venue,
                suggestedVendorNote: suggestion.suggestions.vendorNote,
            },
        });

        return { success: true };
    }, {
        timeout: 30000 // 30 seconds
    });
};