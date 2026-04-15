import express from 'express';
import rateLimit from 'express-rate-limit';
import { submitPublicRSVP, submitPrivateRSVP, validateRSVP, listPublicResponses } from '../controllers/rsvp.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

const rsvpLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
});

router.post('/:token', rsvpLimiter, asyncHandler(submitPublicRSVP));
router.post('/tracked/:token', rsvpLimiter, asyncHandler(submitPrivateRSVP));
router.get('/validate/:token', rsvpLimiter, asyncHandler(validateRSVP));
router.get('/public', requireAuth, asyncHandler(listPublicResponses));



export default router;
