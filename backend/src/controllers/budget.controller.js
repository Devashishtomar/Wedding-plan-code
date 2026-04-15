import {
    addBudgetItem,
    listBudgetItems,
    updateBudgetItem,
    deleteBudgetItem,
} from '../services/budget.service.js';

export const createBudgetItem = async (req, res) => {
    const { weddingId, category, estimated, actual } = req.body;

    const item = await addBudgetItem({
        userId: req.user.id,
        weddingId,
        data: { category, estimated, actual },
    });

    res.status(201).json({
        success: true,
        item,
    });
};

export const getBudgetItems = async (req, res) => {
    const { weddingId } = req.params;

    const items = await listBudgetItems({
        userId: req.user.id,
        weddingId,
    });

    res.json({
        success: true,
        items,
    });
};

export const editBudgetItem = async (req, res) => {
    const { itemId } = req.params;

    const item = await updateBudgetItem({
        userId: req.user.id,
        itemId,
        data: req.body,
    });

    res.json({
        success: true,
        item,
    });
};

export const removeBudgetItem = async (req, res) => {
    const { itemId } = req.params;

    await deleteBudgetItem({
        userId: req.user.id,
        itemId,
    });

    res.json({
        success: true,
    });
};
