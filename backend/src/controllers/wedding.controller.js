import { createWedding, getMyWedding, setupWeddingService } from '../services/wedding.service.js';


export const create = async (req, res) => {
    const wedding = await createWedding({
        userId: req.user.id,
        data: req.body,
    });

    res.status(201).json({
        success: true,
        wedding,
    });
};

export const getMine = async (req, res) => {
    const wedding = await getMyWedding(req.user.id);

    res.json({
        success: true,
        wedding,
    });
};


export const setupWedding = async (req, res) => {
    const { date, location, budget, guestCount, weddingType } = req.body;

    if (
        !date ||
        !location ||
        typeof budget !== "number" ||
        typeof guestCount !== "number" ||
        !weddingType
    ) {
        return res.status(400).json({
            success: false,
            message: "All wedding setup fields are required",
        });
    }

    const wedding = await setupWeddingService({
        userId: req.user.id,
        data: {
            date,
            location,
            budget,
            guestCount,
            weddingType,
        },
    });

    res.json({
        success: true,
        wedding,
    });
};
