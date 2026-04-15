import { app } from './src/app.js';
import { initLogger } from './src/loaders/logger.js';
import { connectDB, getPrisma } from './src/loaders/database.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 3000;

initLogger();

await connectDB();

const server = app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
});

const shutdown = async () => {
    logger.info('🛑 Shutting down server...');
    server.close(async () => {
        const prisma = getPrisma();
        await prisma.$disconnect();
        logger.info('✅ Database disconnected');
        process.exit(0);
    });
};

process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});


process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
