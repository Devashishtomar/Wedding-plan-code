import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, addCollaborator } from '../controllers/auth.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10, // strict for auth
});

router.post('/register', authLimiter, asyncHandler(register));
router.post('/login', authLimiter, asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.post('/collaborator', requireAuth, asyncHandler(addCollaborator));

export default router;
