import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { requireWeddingSetup } from '../middlewares/onboarding.middleware.js';
import * as MarketplaceController from '../controllers/marketplace.controller.js';

const router = express.Router();


router.use(requireAuth);
router.use(requireWeddingSetup);


router.get('/vendors', MarketplaceController.fetchVendorsDirectory);
router.get('/vendors/:vendorId', MarketplaceController.fetchVendorProfileDetail);
router.get('/shortlist', MarketplaceController.fetchWeddingShortlist);
router.post('/shortlist/toggle', requirePermission('canEditGuests'), MarketplaceController.postToggleShortlist);
router.post('/vendors/:vendorId/reviews', MarketplaceController.postVendorReview);
router.get('/vendors/:vendorId/reviews', MarketplaceController.fetchVendorReviewsFeed);
router.get('/cities', MarketplaceController.fetchActiveMarketplaceCities);
router.get('/compare', MarketplaceController.fetchComparisonList);
router.post('/compare/toggle', MarketplaceController.postToggleComparison);
router.post('/inquiries', requirePermission('canEditGuests'), MarketplaceController.postVendorInquiry);

export default router;