import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
    createChecklistTask,
    listChecklistTasks,
    toggleChecklistTask,
    createSubTask,
    updateChecklistTask,
    toggleChecklistSubTask,
    deleteChecklistSubTask,
    deleteChecklistTask,
} from '../controllers/checklist.controller.js';

const router = express.Router();

router.get('/', requireAuth, requireWeddingSetup, asyncHandler(listChecklistTasks));

router.post('/', requireAuth, requireWeddingSetup, requirePermission('canEditCombinedView'), asyncHandler(createChecklistTask));
router.patch('/:taskId', requireAuth, requireWeddingSetup, requirePermission('canEditCombinedView'), asyncHandler(updateChecklistTask));
router.patch('/:taskId/toggle', requireAuth, requireWeddingSetup, requirePermission('canEditCombinedView'), asyncHandler(toggleChecklistTask));
router.delete('/:taskId', requireAuth, requireWeddingSetup, requirePermission('canEditCombinedView'), asyncHandler(deleteChecklistTask));

router.post('/:taskId/subtasks', requireAuth, requireWeddingSetup, requirePermission('canEditCombinedView'), asyncHandler(createSubTask));
router.patch('/subtasks/:subtaskId/toggle', requireAuth, requireWeddingSetup, requirePermission('canEditCombinedView'), asyncHandler(toggleChecklistSubTask));
router.delete('/subtasks/:subtaskId', requireAuth, requireWeddingSetup, requirePermission('canEditCombinedView'), asyncHandler(deleteChecklistSubTask));

export default router;