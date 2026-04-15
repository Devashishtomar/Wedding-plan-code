import { submitRSVP, submitTrackedRSVP, resolveRSVPToken } from '../services/rsvp.service.js';
import { getPrisma } from '../loaders/database.js';

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

    const wedding = await prisma.wedding.findFirst({
        where: { userId: req.user.id },
    });

    if (!wedding) {
        return res.json({ responses: [] });
    }

    const responses = await prisma.guest.findMany({
        where: {
            weddingId: wedding.id,
            email: null, // public RSVPs only
        },
        select: {
            id: true,
            name: true,
            rsvp: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    res.json({
        responses: responses.map(r => ({
            id: r.id,
            name: r.name,
            attending: r.rsvp === 'ACCEPTED',
            submittedAt: r.createdAt,
        })),
    });
};
