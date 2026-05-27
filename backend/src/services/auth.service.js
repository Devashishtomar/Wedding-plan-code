import jwt from 'jsonwebtoken';
import { getPrisma } from '../loaders/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { logActivity } from '../utils/activityLogger.utility.js';

const signToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });
};

export const registerUser = async ({ name, email, password }) => {
    const prisma = getPrisma();
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        const error = new Error('User already exists');
        error.statusCode = 409;
        throw error;
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const wedding = await prisma.wedding.create({
        data: {
            date: null,
            location: null,
            budget: 0,
            guestCount: 0,
            weddingType: null,
            setupCompleted: false,
        },
    });

    await prisma.weddingMember.create({
        data: {
            userId: user.id,
            weddingId: wedding.id,
            role: 'PENDING',
            canViewPrivate: true,
            canEditPrivate: true,
            canEditCombinedView: true,
            canEditGuests: true,
            canManageBudget: true,
            canManageEvents: true,
        }
    });

    const token = signToken({ userId: user.id });

    return { user, token };
};

export const loginUser = async ({ email, password }) => {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const isValid = await comparePassword(password, user.password);

    if (!isValid) {
        const error = new Error('Invalid credentials');
        error.statusCode = 401;
        throw error;
    }

    const token = signToken({ userId: user.id });

    return { user, token };
};

export const addCollaborator = async ({ name, email, password, role, side, permissions, weddingId, addedById }) => {
    const prisma = getPrisma();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        const hashedPassword = await hashPassword(password);
        user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    }

    const existingMember = await prisma.weddingMember.findUnique({
        where: {
            userId_weddingId: {
                userId: user.id,
                weddingId: weddingId,
            }
        }
    });

    if (existingMember) {
        const error = new Error('User is already connected to this wedding');
        error.statusCode = 409;
        throw error;
    }

    const isCouple = role === 'BRIDE' || role === 'GROOM';
    const memberSide = isCouple ? role : (side === 'SHARED' ? null : (side || null));

    const cleanDbRole = ['BRIDE', 'GROOM', 'FAMILY', 'OTHER', 'PENDING'].includes(role) ? role : 'OTHER';

    const newMember = await prisma.weddingMember.create({
        data: {
            userId: user.id,
            weddingId: weddingId,
            role: cleanDbRole,
            side: memberSide,
            canViewPrivate: isCouple ? true : permissions?.canViewPrivate || false,
            canEditPrivate: isCouple ? true : permissions?.canEditPrivate || false,
            canEditCombinedView: isCouple ? true : permissions?.canEditCombinedView || false,
            canEditGuests: isCouple ? true : permissions?.canEditGuests || false,
            canManageBudget: isCouple ? true : permissions?.canManageBudget || false,
            canManageEvents: isCouple ? true : permissions?.canManageEvents || false,
        }
    });

    await logActivity(
        weddingId,
        addedById,
        'CREATE',
        'WEDDING_MEMBER',
        { addedEmail: email, role: role }
    );

    return { user, member: newMember };
};