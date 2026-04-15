import {
    listGuests as listGuestsService,
    createGuest as createGuestService,
    updateGuest as updateGuestService,
    deleteGuest as deleteGuestService,
} from '../services/guest.service.js';
import { sendTrackedInvite } from '../services/guestInvite.service.js';
import { env } from '../config/env.js';

/**
 * POST /api/guests
 */
export const createGuest = async (req, res) => {
    const { name, email } = req.body;

    const guest = await createGuestService({
        userId: req.user.id,
        name,
        email,
    });

    res.status(201).json({
        success: true,
        guest,
    });
};

/**
 * GET /api/guests
 */
export const listGuests = async (req, res) => {
    const guests = await listGuestsService({
        userId: req.user.id,
    });

    res.json({
        success: true,
        guests,
    });
};

/**
 * POST /api/guests/:guestId/send-invite
 */
export const sendInvite = async (req, res) => {
    const { guestId } = req.params;

    const invite = await sendTrackedInvite({
        userId: req.user.id,
        guestId,
        appBaseUrl: env.appBaseUrl,
    });

    res.json({
        success: true,
        invite,
    });
};

export const deleteGuest = async (req, res) => {
    const { guestId } = req.params;

    await deleteGuestService({
        userId: req.user.id,
        guestId,
    });

    res.json({
        success: true,
    });
};

export const updateGuest = async (req, res) => {
    const { guestId } = req.params;
    const { name, email } = req.body;

    const guest = await updateGuestService({
        userId: req.user.id,
        guestId,
        name,
        email,
    });

    res.json({
        success: true,
        guest,
    });
};
