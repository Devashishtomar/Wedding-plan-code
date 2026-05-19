import { AIActionType } from "../contracts/actions.enum.js";
import {
    addBudgetItem,
    updateBudgetItem,
    deleteBudgetItem,
} from "../../services/budget.service.js";
import {
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
    addSubTask,
    updateSubTask,
    toggleSubTask,
    deleteSubTask,
} from "../../services/checklist.service.js";
import { createGuest, createGuestsBulk, updateGuest, deleteGuest } from "../../services/guest.service.js";
import { sendTrackedInvite, sendBulkInvites } from "../../services/guestInvite.service.js";
import {
    createInvitation,
    updateInvitation,
} from "../../services/invitation.service.js";
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
    weddingId,
    action,
    payload,
    appBaseUrl,
    eventId,
    view
}) => {
    const targetEventId = eventId === 'all' ? null : (eventId || null);
    switch (action) {
        // BUDGET
        case AIActionType.ADD_BUDGET_ITEM: {
            return addBudgetItem({
                userId,
                weddingId,
                eventId: targetEventId,
                visibility: view || 'SHARED',
                data: {
                    category: payload.category,
                    estimated: payload.estimated,
                    actual: payload.actual || 0,
                },
            });
        }

        case AIActionType.UPDATE_BUDGET_ITEM: {
            const { itemId, data, ...rest } = payload;
            return updateBudgetItem({
                userId,
                weddingId,
                itemId: itemId,
                data: data || rest,
            });
        }

        case AIActionType.DELETE_BUDGET_ITEM: {
            throw new Error("Action Forbidden: AI is not allowed to delete items.");
        }

        // CHECKLIST
        case AIActionType.CREATE_TASK: {
            return createTask({
                userId,
                weddingId,
                eventId: targetEventId,
                visibility: view || 'SHARED',
                data: {
                    title: payload.title,
                    category: payload.category || "General",
                    priority: payload.priority || "medium",
                    dueDate: payload.dueDate,
                },
            });
        }

        case AIActionType.UPDATE_TASK: {
            const { taskId, data, ...rest } = payload;
            return updateTask({
                userId,
                weddingId,
                taskId: taskId,
                data: data || rest,
            });
        }

        case AIActionType.TOGGLE_TASK: {
            return toggleTask({
                userId,
                weddingId,
                taskId: payload.taskId,
            });
        }

        case AIActionType.CREATE_SUBTASK: {
            return addSubTask({
                userId,
                weddingId,
                taskId: payload.taskId,
                title: payload.title,
            });
        }

        case AIActionType.TOGGLE_SUBTASK: {
            return toggleSubTask({
                userId,
                weddingId,
                subtaskId: payload.subtaskId,
            });
        }

        case AIActionType.UPDATE_SUBTASK: {
            const { subtaskId, ...data } = payload;
            return updateSubTask({
                userId,
                weddingId,
                subtaskId,
                ...data,
            });
        }

        case AIActionType.DELETE_TASK:
        case AIActionType.DELETE_SUBTASK: {
            throw new Error("Action Forbidden: AI is not allowed to delete tasks.");
        }

        // GUESTS
        case AIActionType.CREATE_GUEST: {
            return createGuest({
                userId,
                weddingId,
                eventId: targetEventId,
                visibility: view || 'SHARED',
                name: payload.name,
                email: payload.email || null,
            });
        }

        case AIActionType.CREATE_GUESTS_BULK: {
            return createGuestsBulk({
                userId,
                weddingId,
                eventId: targetEventId,
                visibility: view || 'SHARED',
                guests: payload.guests,
            });
        }

        case AIActionType.UPDATE_GUEST: {
            const { guestId, ...data } = payload;
            return updateGuest({
                userId,
                weddingId,
                guestId,
                ...data,
            });
        }

        case AIActionType.DELETE_GUEST: {
            throw new Error("Action Forbidden: AI is not allowed to delete guests.");
        }

        case AIActionType.SEND_GUEST_INVITE: {
            return sendTrackedInvite({
                userId,
                weddingId,
                guestId: payload.guestId,
                appBaseUrl,
            });
        }

        case AIActionType.SEND_BULK_INVITES: {
            return sendBulkInvites({
                userId,
                weddingId,
                guestIds: payload.guestIds,
                appBaseUrl,
            });
        }

        // INVITATION
        case AIActionType.CREATE_INVITATION: {
            return createInvitation({
                userId,
                weddingId,
                eventId: targetEventId,
                visibility: view || 'SHARED',
                message: payload.message,
            });
        }

        case AIActionType.UPDATE_INVITATION: {
            return updateInvitation({
                userId,
                weddingId,
                invitationId: payload.invitationId,
                message: payload.message,
            });
        }

        // WEDDING
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

        // SAFETY FALLBACK
        default:
            throw new Error(`Unsupported AI action: ${action}`);
    }
};
