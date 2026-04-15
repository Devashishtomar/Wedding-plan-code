import express from 'express';
import { create, getMine, setupWedding } from '../controllers/wedding.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Protected routes
router.post('/', requireAuth, asyncHandler(create));
router.get('/me', requireAuth, asyncHandler(getMine));
router.patch("/setup", requireAuth, asyncHandler(setupWedding));

export default router;
