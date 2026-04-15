import { getPrisma } from "../../loaders/database.js";
import { getDashboardSummary } from "../../services/dashboard.service.js";

export const buildAIContext = async (userId) => {
    const prisma = getPrisma();

    // -----------------------------
    // Meta
    // -----------------------------
    const now = new Date();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // -----------------------------
    // Dashboard summary (primary aggregator)
    // -----------------------------
    const dashboard = await getDashboardSummary(userId);

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

    // -----------------------------
    // Wedding
    // -----------------------------
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

    // -----------------------------
    // Budget
    // -----------------------------
    const budget = {
        totalPlanned: dashboard.budget.total,
        totalSpent: dashboard.budget.spent,
        remaining: dashboard.budget.remaining,
        itemsCount: null, // intentionally omitted (can be added later)
        hasAnyBudget: dashboard.budget.total > 0,
    };

    // -----------------------------
    // Checklist
    // -----------------------------
    const upcomingTasks =
        dashboard.tasks.upcoming?.map((task) => {
            const dueDate = task.dueDate ? new Date(task.dueDate) : null;
            const dueInDays =
                dueDate !== null
                    ? Math.ceil(
                        (dueDate.getTime() - now.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                    : null;

            return {
                title: task.title,
                dueInDays,
                priority: task.priority,
            };
        }) || [];

    const checklist = {
        totalTasks: dashboard.tasks.total,
        completedTasks: dashboard.tasks.completed,
        pendingTasks:
            dashboard.tasks.total - dashboard.tasks.completed,
        completionPercent:
            dashboard.tasks.total > 0
                ? Math.round(
                    (dashboard.tasks.completed /
                        dashboard.tasks.total) *
                    100
                )
                : 0,
        upcomingTasks,
    };

    // -----------------------------
    // Guests
    // -----------------------------
    const guests = {
        total: dashboard.guests.total,
        responded: dashboard.guests.responded,
        pending:
            dashboard.guests.total - dashboard.guests.responded,
        responseRatePercent:
            dashboard.guests.total > 0
                ? Math.round(
                    (dashboard.guests.responded /
                        dashboard.guests.total) *
                    100
                )
                : 0,
        hasTrackedInvites: true, // safe assumption for now
    };

    // -----------------------------
    // Invitation
    // -----------------------------
    const invitationRecord = await prisma.invitation.findFirst({
        where: {
            weddingId: dashboard.wedding.id,
        },
        select: {
            message: true,
            token: true,
        },
    });

    const invitation = {
        exists: Boolean(invitationRecord),
        messageLength: invitationRecord?.message
            ? invitationRecord.message.length
            : 0,
        publicLinkCreated: Boolean(invitationRecord?.token),
    };

    // -----------------------------
    // Capabilities (reinforces safety)
    // -----------------------------
    const capabilities = {
        canAddBudget: true,
        canCreateTasks: true,
        canSendInvites: true,
        canUpdateWedding: true,
        canDelete: false,
    };

    // -----------------------------
    // Final Context
    // -----------------------------
    return {
        meta: {
            dateToday: now.toISOString().split("T")[0],
            timezone,
            hasPendingAction: false, // will be overridden by orchestrator
        },
        wedding,
        budget,
        checklist,
        guests,
        invitation,
        capabilities,
    };
};
