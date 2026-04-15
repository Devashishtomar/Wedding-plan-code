import express from "express";
import { handleAIMessage } from "../controllers/ai.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireWeddingSetup } from "../middlewares/onboarding.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import rateLimit from "express-rate-limit";

const router = express.Router();

const aiLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,                // 20 AI messages per minute per user/IP
    standardHeaders: true,
    legacyHeaders: false,
});


router.post("/message", requireAuth, requireWeddingSetup, aiLimiter, asyncHandler(handleAIMessage));

export default router;
