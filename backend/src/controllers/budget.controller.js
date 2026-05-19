import {
    addBudgetItem,
    listBudgetItems,
    updateBudgetItem,
    deleteBudgetItem,
} from '../services/budget.service.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';
import { logActivity } from '../utils/activityLogger.utility.js';

export const getBudgetItems = async (req, res) => {
    const viewType = req.query.view || 'SHARED';
    const visibilityFilter = getVisibilityFilter(req, viewType);

    const items = await listBudgetItems({ visibilityFilter });

    res.json({
        success: true,
        items,
    });
};

export const createBudgetItem = async (req, res) => {
    const { category, estimated, actual, visibility, eventId } = req.body;

    const item = await addBudgetItem({
        userId: req.user.id,
        weddingId: req.weddingId,
        eventId: eventId || null,
        data: { category, estimated, actual, visibility: visibility || 'SHARED' },
    });

    await logActivity(
        req.weddingId,
        req.user.id,
        'CREATE',
        'BUDGET_ITEM',
        { itemId: item.id, category },
        eventId || null,
        visibility || 'SHARED'
    );

    res.status(201).json({ success: true, item });
};

export const editBudgetItem = async (req, res) => {
    const { itemId } = req.params;
    const { visibility, eventId } = req.body; // FIXED: Extract pillars for logging

    const item = await updateBudgetItem({
        userId: req.user.id,
        weddingId: req.weddingId,
        itemId,
        data: req.body,
    });

    // FIXED: Secure logging with event and visibility pillars to prevent data leaks
    await logActivity(
        req.weddingId,
        req.user.id,
        'UPDATE',
        'BUDGET_ITEM',
        { itemId, updatedFields: Object.keys(req.body) },
        eventId || item.eventId, // Maintain context
        visibility || item.visibility
    );

    res.json({ success: true, item });
};

export const removeBudgetItem = async (req, res) => {
    const { itemId } = req.params;

    await deleteBudgetItem({
        weddingId: req.weddingId,
        itemId,
    });

    await logActivity(req.weddingId, req.user.id, 'DELETE', 'BUDGET_ITEM', { itemId });

    res.json({
        success: true,
        message: 'Budget item removed successfully',
    });
};