import { getPrisma } from "../loaders/database.js";

export const requireWeddingSetup = async (req, res, next) => {
    const prisma = getPrisma();

    if (!req.weddingId) {
        return res.status(404).json({
            success: false,
            message: "Wedding workspace not found for this user",
        });
    }

    const wedding = await prisma.wedding.findUnique({
        where: { id: req.weddingId },
        select: { setupCompleted: true },
    });

    if (!wedding) {
        return res.status(404).json({
            success: false,
            message: "Wedding not found",
        });
    }
    
    if (!wedding.setupCompleted) {
        return res.status(403).json({
            success: false,
            code: "WEDDING_SETUP_REQUIRED",
            message: "Please complete wedding setup first",
        });
    }

    next();
};
