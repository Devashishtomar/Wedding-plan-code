import express from 'express';
import { getDashboard } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', requireAuth, requireWeddingSetup, asyncHandler(getDashboard));

export default router;
