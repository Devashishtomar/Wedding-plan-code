import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    createGuest,
    listGuests,
    sendInvite,
    updateGuest,
    deleteGuest,
} from '../controllers/guest.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const publicRSVPLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
});

// Protected routes only
router.get('/', requireAuth, requireWeddingSetup, asyncHandler(listGuests));
router.post('/', requireAuth, requireWeddingSetup, requirePermission('canEditGuests'), asyncHandler(createGuest));
router.post('/:guestId/send-invite', requireAuth, requireWeddingSetup, requirePermission('canEditGuests'), asyncHandler(sendInvite));
router.patch('/:guestId', requireAuth, requireWeddingSetup, requirePermission('canEditGuests'), asyncHandler(updateGuest));
router.delete('/:guestId', requireAuth, requireWeddingSetup, requirePermission('canEditGuests'), asyncHandler(deleteGuest));


export default router;



