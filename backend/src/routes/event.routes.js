import express from 'express';
import {
    createEvent,
    listEvents,
    updateEvent,
    deleteEvent
} from '../controllers/event.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', requireAuth, requireWeddingSetup, asyncHandler(listEvents));

router.post('/', requireAuth, requireWeddingSetup, requirePermission('canManageEvents'), asyncHandler(createEvent));
router.patch('/:id', requireAuth, requireWeddingSetup, requirePermission('canManageEvents'), asyncHandler(updateEvent));
router.delete('/:id', requireAuth, requireWeddingSetup, requirePermission('canManageEvents'), asyncHandler(deleteEvent));

export default router;