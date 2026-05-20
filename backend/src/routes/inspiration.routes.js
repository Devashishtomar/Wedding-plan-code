import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { requireWeddingSetup } from '../middlewares/onboarding.middleware.js';
import { discoverInspirations, pinItem, getBoard, unpinItem } from '../controllers/inspiration.controller.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireWeddingSetup);

router.get('/search', discoverInspirations);
router.get('/board', getBoard);
router.post('/pin', requirePermission('canManageEvents'), pinItem);
router.delete('/pin/:id', requirePermission('canManageEvents', true), unpinItem);

export default router;