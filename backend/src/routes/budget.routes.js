import express from 'express';
import {
    createBudgetItem,
    getBudgetItems,
    editBudgetItem,
    removeBudgetItem,
} from '../controllers/budget.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/', requireAuth, requireWeddingSetup, asyncHandler(createBudgetItem));
router.get('/:weddingId', requireAuth, requireWeddingSetup, asyncHandler(getBudgetItems));
router.patch('/:itemId', requireAuth, requireWeddingSetup, asyncHandler(editBudgetItem));
router.delete('/:itemId', requireAuth, requireWeddingSetup, asyncHandler(removeBudgetItem));

export default router;
