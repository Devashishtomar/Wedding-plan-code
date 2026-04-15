import { AIActionType } from "../contracts/actions.enum.js";

// Budget
import {
    addBudgetItem,
    updateBudgetItem,
} from "../../services/budget.service.js";

// Checklist
import {
    createTask,
    updateTask,
    toggleTask,
    addSubTask,
    toggleSubTask,
} from "../../services/checklist.service.js";

// Guests
import { createGuest } from "../../services/guest.service.js";
import { sendTrackedInvite } from "../../services/guestInvite.service.js";

// Invitation
import {
    createInvitation,
    updateInvitation,
} from "../../services/invitation.service.js";

// Wedding
import { getPrisma } from "../../loaders/database.js";

/**
 * Execute a validated AI action.
 *
 * IMPORTANT:
 * - This function assumes:
 *   - action is whitelisted
 *   - payload is validated
 * - All authorization is enforced inside services
 */
export const executeAIAction = async ({
    userId,
    action,
    payload,
    appBaseUrl,
}) => {
    switch (action) {
        // =========================
        // BUDGET
        // =========================
        case AIActionType.ADD_BUDGET_ITEM: {
            const prisma = getPrisma();

            const wedding = await prisma.wedding.findFirst({
                where: { userId },
                select: { id: true },
            });

            if (!wedding) {
                throw new Error("Wedding not found");
            }

            return addBudgetItem({
                userId,
                weddingId: wedding.id,
                data: {
                    category: payload.category,
                    estimated: payload.estimated,
                    actual: payload.actual || 0,
                },
            });
        }

        case AIActionType.UPDATE_BUDGET_ITEM: {
            return updateBudgetItem({
                userId,
                itemId: payload.itemId,
                data: payload.data,
            });
        }

        // =========================
        // CHECKLIST
        // =========================
        case AIActionType.CREATE_TASK: {
            const prisma = getPrisma();

            const wedding = await prisma.wedding.findFirst({
                where: { userId },
                select: { id: true },
            });

            if (!wedding) {
                throw new Error("Wedding not found");
            }

            return createTask({
                userId,
                weddingId: wedding.id,
                data: {
                    title: payload.title,
                    category: payload.category || "General",
                    priority: payload.priority || "medium",
                    dueDate: payload.dueDate,
                },
            });
        }

        case AIActionType.UPDATE_TASK: {
            return updateTask({
                userId,
                taskId: payload.taskId,
                data: payload.data,
            });
        }

        case AIActionType.TOGGLE_TASK: {
            return toggleTask({
                userId,
                taskId: payload.taskId,
            });
        }

        case AIActionType.CREATE_SUBTASK: {
            return addSubTask({
                userId,
                taskId: payload.taskId,
                title: payload.title,
            });
        }

        case AIActionType.TOGGLE_SUBTASK: {
            return toggleSubTask({
                userId,
                subtaskId: payload.subtaskId,
            });
        }

        // =========================
        // GUESTS
        // =========================
        case AIActionType.CREATE_GUEST: {
            return createGuest({
                userId,
                name: payload.name,
                email: payload.email || null,
            });
        }

        case AIActionType.SEND_GUEST_INVITE: {
            return sendTrackedInvite({
                userId,
                guestId: payload.guestId,
                appBaseUrl,
            });
        }

        // =========================
        // INVITATION
        // =========================
        case AIActionType.CREATE_INVITATION: {
            return createInvitation({
                userId,
                message: payload.message,
            });
        }

        case AIActionType.UPDATE_INVITATION: {
            return updateInvitation({
                userId,
                invitationId: payload.invitationId,
                message: payload.message,
            });
        }

        // =========================
        // WEDDING
        // =========================
        case AIActionType.UPDATE_WEDDING_DETAILS: {
            const prisma = getPrisma();

            const wedding = await prisma.wedding.findFirst({
                where: { userId },
            });

            if (!wedding) {
                throw new Error("Wedding not found");
            }

            return prisma.wedding.update({
                where: { id: wedding.id },
                data: {
                    ...(payload.date && { date: new Date(payload.date) }),
                    ...(payload.location && { location: payload.location }),
                    ...(typeof payload.budget === "number" && {
                        budget: payload.budget,
                    }),
                    ...(typeof payload.guestCount === "number" && {
                        guestCount: payload.guestCount,
                    }),
                    ...(payload.weddingType && {
                        weddingType: payload.weddingType,
                    }),
                },
            });
        }

        // =========================
        // SAFETY FALLBACK
        // =========================
        default:
            throw new Error(`Unsupported AI action: ${action}`);
    }
};
