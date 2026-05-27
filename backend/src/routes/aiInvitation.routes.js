import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from '../middlewares/onboarding.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import * as AiInvitationController from '../controllers/aiInvitation.controller.js';

const router = express.Router();

router.get('/quota', requireAuth, requireWeddingSetup, AiInvitationController.getQuotaLimits);
router.post('/generate', requireAuth, requireWeddingSetup, requirePermission('canEditCombinedView'), AiInvitationController.postGenerateInvitationTemplate);

export default router;