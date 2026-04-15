import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import {
    createChecklistTask,
    listChecklistTasks,
    toggleChecklistTask,
    createSubTask,
    updateChecklistTask,
    toggleChecklistSubTask,
    deleteChecklistSubTask,
} from '../controllers/checklist.controller.js';

const router = express.Router();

router.post('/', requireAuth, requireWeddingSetup, asyncHandler(createChecklistTask));
router.get('/:weddingId', requireAuth, requireWeddingSetup, asyncHandler(listChecklistTasks));
router.patch('/:taskId/toggle', requireAuth, requireWeddingSetup, asyncHandler(toggleChecklistTask));
router.post('/:taskId/subtasks', requireAuth, requireWeddingSetup, asyncHandler(createSubTask));
router.patch('/:taskId', requireAuth, requireWeddingSetup, asyncHandler(updateChecklistTask));
router.patch('/subtasks/:subtaskId/toggle', requireAuth, requireWeddingSetup, asyncHandler(toggleChecklistSubTask));
router.delete('/subtasks/:subtaskId', requireAuth, requireWeddingSetup, asyncHandler(deleteChecklistSubTask));



export default router;
