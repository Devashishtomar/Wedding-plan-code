import express from 'express';
import {
    createBudgetItem,
    getBudgetItems,
    editBudgetItem,
    removeBudgetItem,
} from '../controllers/budget.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', requireAuth, requireWeddingSetup, asyncHandler(getBudgetItems));

router.post('/', requireAuth, requireWeddingSetup, requirePermission('canManageBudget'), asyncHandler(createBudgetItem));
router.patch('/:itemId', requireAuth, requireWeddingSetup, requirePermission('canManageBudget'), asyncHandler(editBudgetItem));
router.delete('/:itemId', requireAuth, requireWeddingSetup, requirePermission('canManageBudget'), asyncHandler(removeBudgetItem));

export default router;