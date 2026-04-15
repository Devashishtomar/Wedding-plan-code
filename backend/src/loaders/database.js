import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger.js';

let prisma;

export const connectDB = async () => {
    if (!prisma) {
        prisma = new PrismaClient();
    }

    try {
        await prisma.$connect();
        logger.info('✅ Database connected');
    } catch (error) {
        logger.error(error, '❌ Database connection failed');
        process.exit(1);
    }

    return prisma;
};

export const getPrisma = () => {
    if (!prisma) {
        throw new Error('Prisma not initialized');
    }
    return prisma;
};
