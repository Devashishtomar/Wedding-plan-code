import { submitRSVP, submitTrackedRSVP, resolveRSVPToken } from '../services/rsvp.service.js';
import { getPrisma } from '../loaders/database.js';
import { getVisibilityFilter } from '../utils/queryContext.utility.js';

export const submitPublicRSVP = async (req, res) => {
    const { name, response } = req.body;

    if (!name || !response) {
        return res.status(400).json({
            success: false,
            message: 'Missing name or RSVP',
        });
    }

    await submitRSVP({
        token: req.params.token,
        name,
        response,
    });

    res.json({ success: true });
};

export const submitPrivateRSVP = async (req, res) => {
    const { response } = req.body;

    await submitTrackedRSVP({
        token: req.params.token,
        response,
    });

    res.json({ success: true });
};

export const validateRSVP = async (req, res) => {
    const result = await resolveRSVPToken({
        token: req.params.token,
    });

    res.json(result);
};


export const listPublicResponses = async (req, res) => {
    const prisma = getPrisma();

    try {
        // 1. Calculate strict boundaries based on View and Event
        const viewType = req.query.view || 'SHARED';
        const visibilityFilter = getVisibilityFilter(req, viewType);
        const eventId = req.query.eventId;

        const whereClause = {
            ...visibilityFilter,
            email: null, // public RSVPs only
        };

        if (eventId && eventId !== 'all') {
            whereClause.eventId = eventId;
        }

        // 2. Fetch RSVPs safely isolated by the utility
        const responses = await prisma.guest.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                rsvp: true,
                createdAt: true,
                event: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' },
        });

        res.json({
            responses: responses.map(r => ({
                id: r.id,
                name: r.name,
                attending: r.rsvp === 'ACCEPTED',
                submittedAt: r.createdAt,
                eventName: r.event?.name || 'All Events'
            })),
        });
    } catch (error) {
        console.error("Error fetching public RSVPs:", error);
        return res.json({ responses: [] });
    }
};