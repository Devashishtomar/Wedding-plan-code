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
            select: { id: true, email: true },
        });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
