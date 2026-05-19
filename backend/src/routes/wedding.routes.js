import express from 'express';
import { getMine, setupWedding, listMembers, updateMember, removeMember, getSuggestion, acceptSuggestion, updatePrivateSetup } from '../controllers/wedding.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';

const router = express.Router();

// Workspace & Onboarding Routes
router.get('/me', requireAuth, asyncHandler(getMine));
router.patch("/setup", requireAuth, asyncHandler(setupWedding));
router.patch("/private-setup", requireAuth, asyncHandler(updatePrivateSetup));

// Collaborator & RBAC Management Routes
router.get('/members', requireAuth, asyncHandler(listMembers));
router.patch('/members/:memberId', requireAuth, requirePermission('canManageEvents'), asyncHandler(updateMember));
router.delete('/members/:memberId', requireAuth, requirePermission('canManageEvents'), asyncHandler(removeMember));

router.get('/suggestion', requireAuth, asyncHandler(getSuggestion));
router.post('/accept-suggestion', requireAuth, asyncHandler(acceptSuggestion));


export default router;