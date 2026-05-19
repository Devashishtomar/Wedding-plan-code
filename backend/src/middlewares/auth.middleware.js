import jwt from 'jsonwebtoken';
import { getPrisma } from '../loaders/database.js';

export const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.access_token;

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const prisma = getPrisma();
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            select: {
                id: true,
                email: true,
                weddingMembers: {
                    select: {
                        id: true,
                        weddingId: true,
                        role: true,
                        side: true,
                        canViewPrivate: true,
                        canEditPrivate: true,
                        canEditCombinedView: true,
                        canEditGuests: true,
                        canManageBudget: true,
                        canManageEvents: true,
                        privateTargetDate: true,
                        privateTargetBudget: true
                    }
                }
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;

        if (user.weddingMembers && user.weddingMembers.length > 0) {
            req.weddingId = user.weddingMembers[0].weddingId;
            req.memberContext = user.weddingMembers[0];
        }

        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
