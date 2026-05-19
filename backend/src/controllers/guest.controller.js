import {
    listGuests as listGuestsService,
    createGuest as createGuestService,
    updateGuest as updateGuestService,
    deleteGuest as deleteGuestService,
} from '../services/guest.service.js';
import { sendTrackedInvite } from '../services/guestInvite.service.js';
import { env } from '../config/env.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';
import { logActivity } from '../utils/activityLogger.utility.js';

export const listGuests = async (req, res) => {
    // 1. Generate the centralized Prisma 'where' clause based on requested view
    const viewType = req.query.view || 'SHARED';
    const visibilityFilter = getVisibilityFilter(req, viewType);

    const guests = await listGuestsService({ visibilityFilter });

    res.json({
        success: true,
        guests,
    });
};

export const createGuest = async (req, res) => {
    const { name, email, visibility, eventId } = req.body;

    const guest = await createGuestService({
        weddingId: req.weddingId,
        eventId: eventId || null,
        userId: req.user.id,
        name,
        email,
        visibility: visibility || 'SHARED'
    });

    // 2. Fire the immutable audit log
    await logActivity(
        req.weddingId,
        req.user.id,
        'CREATE',
        'GUEST',
        { guestId: guest.id, name: guest.name },
        eventId || null,
        visibility || 'SHARED'
    );

    res.status(201).json({
        success: true,
        guest,
    });
};

export const updateGuest = async (req, res) => {
    const { guestId } = req.params;
    const { name, email, visibility, eventId } = req.body;

    const guest = await updateGuestService({
        weddingId: req.weddingId,
        eventId: eventId !== undefined ? (eventId || null) : undefined,
        userId: req.user.id,
        guestId,
        name,
        email,
        visibility
    });

    await logActivity(
        req.weddingId,
        req.user.id,
        'UPDATE',
        'GUEST',
        { guestId, updatedFields: Object.keys(req.body) },
        eventId || guest.eventId,
        visibility || guest.visibility
    );

    res.json({
        success: true,
        guest,
    });
};

export const deleteGuest = async (req, res) => {
    const { guestId } = req.params;

    await deleteGuestService({
        weddingId: req.weddingId,
        guestId,
    });

    await logActivity(req.weddingId, req.user.id, 'DELETE', 'GUEST', { guestId }, null, 'SHARED');

    res.json({
        success: true,
        message: 'Guest deleted successfully',
    });
};

export const sendInvite = async (req, res) => {
    const { guestId } = req.params;
    const { invitationId } = req.body || {};

    const invite = await sendTrackedInvite({
        weddingId: req.weddingId,
        guestId,
        invitationId,
        appBaseUrl: env.appBaseUrl,
    });

    await logActivity(req.weddingId, req.user.id, 'UPDATE', 'GUEST_INVITE', { guestId, action: 'SENT' });

    res.json({
        success: true,
        invite,
    });
};