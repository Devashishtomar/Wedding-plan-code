import { getPrisma } from '../loaders/database.js';

/**
 * Centrally logs CRUD actions modifying the wedding data to maintain accountability.
 * * @param {String} weddingId - The ID of the wedding workspace.
 * @param {String} userId - The ID of the user performing the action.
 * @param {String} action - e.g., 'CREATE', 'UPDATE', 'DELETE'
 * @param {String} entity - e.g., 'GUEST', 'BUDGET', 'TASK'
 * @param {Object} details - Optional JSON object containing the relevant data
 */

export const logActivity = async (weddingId, userId, action, entity, details = null, eventId = null, visibility = 'SHARED') => {
    try {
        const prisma = getPrisma();
        await prisma.activityLog.create({
            data: {
                weddingId,
                userId,
                eventId: eventId || null,
                visibility: visibility || 'SHARED',
                action,
                entity,
                details: details ? JSON.stringify(details) : null
            }
        });
    } catch (error) {
        console.error(`[Audit Log Failed] ${action} on ${entity} by ${userId}:`, error.message);
    }
};