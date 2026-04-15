import { getPrisma } from "../loaders/database.js";

export const requireWeddingSetup = async (req, res, next) => {
    const prisma = getPrisma();

    const wedding = await prisma.wedding.findFirst({
        where: { userId: req.user.id },
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
