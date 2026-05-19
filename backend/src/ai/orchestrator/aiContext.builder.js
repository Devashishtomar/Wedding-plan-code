import { getPrisma } from "../../loaders/database.js";
import { getDashboardSummary } from "../../services/dashboard.service.js";

export const buildAIContext = async ({ userId, weddingId, visibilityFilter, eventId, view }) => {
    const prisma = getPrisma();

    // Meta
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true }
    }) || { id: userId, name: "User" };

    // Dashboard summary (primary aggregator)
    const dashboard = await getDashboardSummary({
        user,
        weddingId,
        visibilityFilter,
        eventId: eventId === 'all' ? null : (eventId || null)
    });

    // If user somehow has no wedding (extremely rare / defensive)
    if (!dashboard || !dashboard.wedding) {
        return {
            meta: {
                dateToday: now.toISOString().split("T")[0],
                timezone,
                hasPendingAction: false,
            },
            wedding: {
                exists: false,
            },
            capabilities: {
                canAddBudget: false,
                canCreateTasks: false,
                canSendInvites: false,
                canUpdateWedding: false,
                canDelete: false,
            },
        };
    }

    // Wedding
    const weddingDate = dashboard.wedding.date
        ? new Date(dashboard.wedding.date)
        : null;

    const daysUntilWedding =
        weddingDate !== null
            ? Math.ceil(
                (weddingDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
            )
            : null;

    const wedding = {
        exists: true,
        date: weddingDate ? weddingDate.toISOString().split("T")[0] : null,
        daysUntilWedding,
        location: dashboard.wedding.location || null,
        type: null, // intentionally omitted for now (can be added later)
        guestCountPlanned: null,
        setupCompleted: Boolean(
            weddingDate &&
            dashboard.wedding.location &&
            dashboard.budget.total > 0
        ),
    };

    // Budget - FULL DATA
    const budgetItems = await prisma.budgetItem.findMany({
        where: visibilityFilter,
        select: {
            id: true,
            category: true,
            estimated: true,
            actual: true,
        },
    });

    const targetOrAllocated = dashboard.budget.target || dashboard.budget.allocated || 0;

    const budget = {
        totalPlanned: targetOrAllocated,
        totalEstimated: dashboard.budget.estimated || 0,
        totalSpent: dashboard.budget.spent || 0,
        remaining: targetOrAllocated - (dashboard.budget.spent || 0),
        itemsCount: budgetItems.length,
        hasAnyBudget: targetOrAllocated > 0,
        items: budgetItems,
    };

    // Checklist - FULL DATA
    const fullTasks = await prisma.checklistTask.findMany({
        where: visibilityFilter,
        include: {
            subtasks: {
                select: {
                    id: true,
                    title: true,
                    completed: true,
                },
            },
        },
        orderBy: { createdAt: "asc" },
    });

    const checklist = {
        totalTasks: fullTasks.length,
        completedTasks: fullTasks.filter((t) => t.completed).length,
        pendingTasks: fullTasks.filter((t) => !t.completed).length,
        completionPercent:
            fullTasks.length > 0
                ? Math.round(
                    (fullTasks.filter((t) => t.completed).length /
                        fullTasks.length) *
                    100
                )
                : 0,
        tasks: fullTasks.map((t) => ({
            id: t.id,
            title: t.title,
            category: t.category,
            priority: t.priority,
            completed: t.completed,
            dueDate: t.dueDate ? t.dueDate.toISOString().split("T")[0] : null,
            subtasks: t.subtasks,
        })),
    };

    // Guests - FULL DATA
    const allGuests = await prisma.guest.findMany({
        where: visibilityFilter,
        select: {
            id: true,
            name: true,
            email: true,
            rsvp: true,
        },
    });

    // Calculate Insights for AI Proactivity
    const issues = [];
    const missingEmails = allGuests.filter(g => !g.email).length;
    if (missingEmails > 0) issues.push(`${missingEmails} guests are missing email addresses.`);

    const budgetOver = budget.totalSpent > budget.totalPlanned;
    if (budgetOver) issues.push(`The total spent (${budget.totalSpent}) exceeds the planned budget (${budget.totalPlanned}).`);

    const overdueTasks = checklist.tasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < now).length;
    if (overdueTasks > 0) issues.push(`${overdueTasks} tasks are overdue.`);

    const guests = {
        total: allGuests.length,
        responded: allGuests.filter((g) => g.rsvp !== "PENDING").length,
        pending: allGuests.filter((g) => g.rsvp === "PENDING").length,
        responseRatePercent:
            allGuests.length > 0
                ? Math.round(
                    (allGuests.filter((g) => g.rsvp !== "PENDING").length /
                        allGuests.length) *
                    100
                )
                : 0,
        list: allGuests,
        hasTrackedInvites: true,
        missingEmailsCount: missingEmails,
    };

    // Invitation
    const invitationRecord = await prisma.invitation.findFirst({
        where: visibilityFilter,
        select: {
            id: true,
            message: true,
            token: true,
        },
    });

    const invitation = {
        exists: Boolean(invitationRecord),
        id: invitationRecord?.id || null,
        message: invitationRecord?.message || null,
        publicLinkCreated: Boolean(invitationRecord?.token),
    };

    // Capabilities (reinforces safety)
    const capabilities = {
        canAddBudget: true,
        canCreateTasks: true,
        canSendInvites: true,
        canUpdateWedding: true,
        canDelete: false, // Strict rule: No deletion allowed
    };

    // Final Context
    return {
        meta: {
            dateToday: now.toISOString().split("T")[0],
            timezone,
            hasPendingAction: false, // will be overridden by orchestrator
            issues, // AI will see these as primary pointers
        },
        wedding,
        budget,
        checklist,
        guests,
        invitation,
        recentActivity: dashboard.recentActivity,
        capabilities,
    };
};
