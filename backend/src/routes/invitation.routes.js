import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    getMyInvite,
    createInvite,
    updateInvite,
    viewInvite,
    listTemplates,
    getTemplate,
    getDesignOptions,
    renderInvitation,
} from '../controllers/invitation.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { asyncHandler } from '../utils/asyncHandler.js';
import { saveCustomInvitation } from '../controllers/customInvitation.controller.js';
import { uploadLocal } from '../middlewares/upload.middleware.js';

const router = express.Router();

const publicInviteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
});

// Authenticated
router.get('/me', requireAuth, requireWeddingSetup, asyncHandler(getMyInvite));
router.post('/', requireAuth, requireWeddingSetup, asyncHandler(createInvite));
router.patch('/:id', requireAuth, requireWeddingSetup, asyncHandler(updateInvite));
router.get('/templates', requireAuth, requireWeddingSetup, asyncHandler(listTemplates));
router.get('/templates/:id', requireAuth, requireWeddingSetup, asyncHandler(getTemplate));
router.get('/design-options', requireAuth, requireWeddingSetup, asyncHandler(getDesignOptions));
router.get('/:id/render', requireAuth, requireWeddingSetup, asyncHandler(renderInvitation));
router.post('/custom', requireAuth, requireWeddingSetup, uploadLocal.single('background'), asyncHandler(saveCustomInvitation));


export default router;
