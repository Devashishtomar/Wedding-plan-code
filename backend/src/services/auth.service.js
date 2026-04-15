import jwt from 'jsonwebtoken';
import { getPrisma } from '../loaders/database.js';
import { hashPassword, comparePassword } from '../utils/password.js';

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

    await prisma.wedding.create({
        data: {
            userId: user.id,
            date: null,
            location: null,
            budget: 0,
            guestCount: 0,
            weddingType: null,
            setupCompleted: false,
        },
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
