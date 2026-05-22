import express from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/rbac.middleware.js';
import { requireWeddingSetup } from '../middlewares/onboarding.middleware.js';
import * as PlannerController from '../controllers/planner.controller.js';

const router = express.Router();

router.use(requireAuth);
router.use(requireWeddingSetup);

// Base operations
router.get('/', PlannerController.fetchArrangements);
router.get('/guests/confirmed', PlannerController.fetchConfirmedGuests);
router.get('/:id', PlannerController.fetchArrangementDetail);
router.post('/', requirePermission('canManageEvents'), PlannerController.createArrangement);
router.delete('/:id', requirePermission('canManageEvents', true), PlannerController.deleteArrangement);

// Seating layout mutations
router.post('/:id/tables', requirePermission('canManageEvents'), PlannerController.postTable);
router.put('/tables/:tableId', requirePermission('canManageEvents'), PlannerController.updateTable);
router.put('/tables/:tableId/seats', requirePermission('canManageEvents'), PlannerController.putSeat);
router.put('/tables/:tableId/seats/batch', requirePermission('canManageEvents'), PlannerController.batchSaveSeats);
router.delete('/tables/:tableId', requirePermission('canManageEvents'), PlannerController.deleteTable);
router.delete('/tables/:tableId/seats', requirePermission('canManageEvents'), PlannerController.deleteSeatAssignment);
router.post('/:id/companions', requirePermission('canManageEvents'), PlannerController.createCompanion);
router.delete('/companions/:companionId', requirePermission('canManageEvents'), PlannerController.deleteCompanion);

// Room allocation mutations
router.post('/:id/rooms', requirePermission('canManageEvents'), PlannerController.postRoom);
router.put('/rooms/:roomId', requirePermission('canManageEvents'), PlannerController.updateRoom);
router.put('/rooms/:roomId/guests/batch', requirePermission('canManageEvents'), PlannerController.batchSaveRoomGuests);
router.delete('/rooms/:roomId', requirePermission('canManageEvents'), PlannerController.deleteRoom);
router.put('/rooms/:roomId/guests', requirePermission('canManageEvents'), PlannerController.putRoomAllocation);
router.delete('/rooms/:roomId/guests', requirePermission('canManageEvents'), PlannerController.deleteRoomAllocation);

export default router;