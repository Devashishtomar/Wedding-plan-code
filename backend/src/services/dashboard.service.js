import { getPrisma } from '../loaders/database.js';


const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
};


export const getDashboardSummary = async (userId) => {
    const prisma = getPrisma();

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            name: true,
        },
    });


    const wedding = await prisma.wedding.findFirst({
        where: { userId },
        select: {
            id: true,
            date: true,
            location: true,
        },
    });

    if (!wedding) {
        return null;
    }

    const daysRemaining = Math.ceil(
        (new Date(wedding.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    // Total guests (public + private)
    const totalGuests = await prisma.guest.count({
        where: { weddingId: wedding.id },
    });

    // Guests who have responded (any response)
    const respondedGuests = await prisma.guest.count({
        where: {
            weddingId: wedding.id,
            rsvp: {
                not: 'PENDING',
            },
        },
    });


    const totalTasks = await prisma.checklistTask.count({
        where: { weddingId: wedding.id },
    });

    const completedTasks = await prisma.checklistTask.count({
        where: {
            weddingId: wedding.id,
            completed: true,
        },
    });

    const upcomingTasks = await prisma.checklistTask.findMany({
        where: {
            weddingId: wedding.id,
            completed: false,
            dueDate: {
                gte: new Date(),
                lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        },
        select: {
            id: true,
            title: true,
            dueDate: true,
            priority: true,
        },
        orderBy: { dueDate: 'asc' },
        take: 5,
    });

    // Budget aggregation (future-ready)
    const budgetTotals = await prisma.budgetItem.aggregate({
        where: { weddingId: wedding.id },
        _sum: {
            estimated: true,
            actual: true,
        },
    });

    const total = budgetTotals._sum.estimated || 0;
    const spent = budgetTotals._sum.actual || 0;

    const budget = {
        total,
        spent,
        remaining: total - spent,
    };


    // =====================
    // Recent Activity (STEP 4)
    // =====================
    const rsvpEvents = (await prisma.guest.findMany({
        where: {
            weddingId: wedding.id,
            rsvp: { not: 'PENDING' },
            createdAt: { gte: startOfToday() },
        },
        select: { name: true, createdAt: true },
        take: 5,
    })).map(g => ({
        type: 'RSVP',
        message: `${g.name} responded`,
        timestamp: g.createdAt,
    }));

    const guestEvents = (await prisma.guest.findMany({
        where: {
            weddingId: wedding.id,
            createdAt: { gte: startOfToday() },
        },
        select: { name: true, createdAt: true },
        take: 5,
    })).map(g => ({
        type: 'GUEST',
        message: `${g.name} added to guest list`,
        timestamp: g.createdAt,
    }));

    const taskEvents = (await prisma.checklistTask.findMany({
        where: {
            weddingId: wedding.id,
            completed: true,
            createdAt: { gte: startOfToday() },
        },
        select: { title: true, createdAt: true },
        take: 5,
    })).map(t => ({
        type: 'TASK',
        message: `Task completed: ${t.title}`,
        timestamp: t.createdAt,
    }));

    const budgetEvents = (await prisma.budgetItem.findMany({
        where: {
            weddingId: wedding.id,
            createdAt: { gte: startOfToday() },
        },
        select: { category: true, createdAt: true },
        take: 5,
    })).map(b => ({
        type: 'BUDGET',
        message: `Budget updated: ${b.category}`,
        timestamp: b.createdAt,
    }));

    const recentActivity = [
        ...rsvpEvents,
        ...guestEvents,
        ...taskEvents,
        ...budgetEvents,
    ]
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, 5);



    return {
        user: {
            name: user?.name || null,
        },
        wedding: {
            id: wedding.id,
            location: wedding.location,
            date: wedding.date,
            daysRemaining,
        },
        guests: {
            total: totalGuests,
            responded: respondedGuests,
        },
        tasks: {
            total: totalTasks,
            completed: completedTasks,
            upcoming: upcomingTasks,
        },
        budget,
        recentActivity,
    };
};
