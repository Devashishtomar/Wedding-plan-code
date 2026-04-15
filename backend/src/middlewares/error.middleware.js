import logger from '../utils/logger.js';

export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    logger.error(
        {
            method: req.method,
            path: req.originalUrl,
            statusCode,
            message: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        },
        'Unhandled error'
    );

    res.status(statusCode).json({
        success: false,
        message:
            process.env.NODE_ENV === 'production'
                ? 'Something went wrong'
                : err.message,
    });
};
