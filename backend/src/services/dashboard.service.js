import { getPrisma } from '../loaders/database.js';

export const getDashboardSummary = async ({ weddingId, eventId, user, visibilityFilter }) => {
    const prisma = getPrisma();

    let contextDate, contextLocation, contextTargetBudget;

    if (eventId) {
        const event = await prisma.event.findFirst({
            where: { id: eventId, weddingId },
            select: { date: true, location: true, budget: true }
        });
        if (!event) return null;
        contextDate = event.date;
        contextLocation = event.location;
        contextTargetBudget = event.budget || 0;
    } else {
        if (visibilityFilter.visibility === 'BRIDE_PRIVATE' || visibilityFilter.visibility === 'GROOM_PRIVATE') {
            const member = await prisma.weddingMember.findFirst({
                where: { userId: user.id, weddingId },
                select: { privateTargetDate: true, privateTargetBudget: true }
            });
            contextDate = member?.privateTargetDate || null;
            contextLocation = "Private View Workspace";
            contextTargetBudget = member?.privateTargetBudget || 0;
        } else {
            const wedding = await prisma.wedding.findUnique({
                where: { id: weddingId },
                select: { date: true, location: true, budget: true },
            });
            if (!wedding) return null;
            contextDate = wedding.date;
            contextLocation = wedding.location;
            contextTargetBudget = wedding.budget || 0;
        }
    }

    const daysRemaining = contextDate
        ? Math.ceil((new Date(contextDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : null;

    // 1. Guests Summary (Powers the "10/300 Guests Confirmed" card)
    const totalGuests = await prisma.guest.count({ where: visibilityFilter });
    const respondedGuests = await prisma.guest.count({
        where: { ...visibilityFilter, rsvp: { not: 'PENDING' } },
    });

    // 2. Tasks Summary (Powers the "10/30 Tasks Done" card)
    const totalTasks = await prisma.checklistTask.count({ where: visibilityFilter });
    const completedTasks = await prisma.checklistTask.count({
        where: { ...visibilityFilter, completed: true },
    });

    // 3. Upcoming Tasks (Next 7 Days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const upcomingTasks = await prisma.checklistTask.findMany({
        where: {
            ...visibilityFilter,
            completed: false,
            dueDate: {
                gte: new Date(),
                lte: nextWeek
            }
        },
        select: { id: true, title: true, dueDate: true, priority: true },
        orderBy: { dueDate: 'asc' },
        take: 5
    });

    // 4. Budget Summary (Powers the charts and spent/remaining cards)
    const budgetItems = await prisma.budgetItem.findMany({
        where: visibilityFilter,
        select: { category: true, estimated: true, actual: true }
    });

    let totalEstimated = 0;
    let totalActual = 0;
    const budgetByCategory = budgetItems.reduce((acc, item) => {
        totalEstimated += item.estimated;
        totalActual += item.actual;
        acc[item.category] = (acc[item.category] || 0) + item.actual;
        return acc;
    }, {});

    let totalAllocated = 0;
    let eventAllocations = [];

    if (!eventId) {
        const allEvents = await prisma.event.findMany({
            where: visibilityFilter,
            select: { id: true, name: true, budget: true },
            orderBy: { date: 'asc' }
        });
        totalAllocated = allEvents.reduce((sum, e) => sum + (e.budget || 0), 0);
        eventAllocations = allEvents.map(e => ({ name: e.name, budget: e.budget || 0 }));
    } else {
        totalAllocated = contextTargetBudget;
    }

    // 5. Curated Activity Feed (Filtering out the noise, showing only milestones)
    const recentLogs = await prisma.activityLog.findMany({
        where: {
            ...visibilityFilter,
            OR: [
                { entity: 'GUEST', action: 'CREATE' },
                { entity: 'GUEST', action: 'UPDATE' },
                { entity: 'TASK', action: 'UPDATE' }
            ]
        },
        orderBy: { createdAt: 'desc' },
        take: 15 // Fetch extra to ensure we have enough after filtering out noise
    });

    const recentActivity = recentLogs.map(log => {
        const details = log.details ? JSON.parse(log.details) : {};

        // Translate raw audit logs into human-friendly milestones
        if (log.entity === 'GUEST' && log.action === 'CREATE') {
            return { type: 'GUEST', message: `New guest added: ${details.name || 'Guest'}`, timestamp: log.createdAt };
        }
        if (log.entity === 'GUEST' && log.action === 'UPDATE' && details.updatedFields?.includes('rsvp')) {
            return { type: 'RSVP', message: `RSVP updated for a guest`, timestamp: log.createdAt };
        }
        if (log.entity === 'TASK' && log.action === 'UPDATE' && details.action === 'TOGGLED_STATUS') {
            return { type: 'TASK', message: `A task was completed`, timestamp: log.createdAt };
        }
        return null;
    })
        .filter(Boolean) // Remove nulls (noisy logs we ignored)
        .slice(0, 5);    // Send exactly the top 5 to the frontend

    // Send the exact data contract the frontend UI expects
    return {
        user: { name: user.name },
        wedding: {
            id: weddingId,
            location: contextLocation,
            date: contextDate,
            daysRemaining,
        },
        guests: {
            total: totalGuests,
            responded: respondedGuests,
        },
        tasks: {
            total: totalTasks,
            completed: completedTasks,
            upcoming: upcomingTasks, // Restored the 7-day checklist
        },
        budget: {
            target: contextTargetBudget,
            allocated: totalAllocated,
            estimated: totalEstimated,
            spent: totalActual,
            byCategory: budgetByCategory,
            eventAllocations,
        },
        recentActivity,
    };
};