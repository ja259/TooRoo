import { createLogger, transports, format } from 'winston';

// Create a logger instance with specified configuration
const logger = createLogger({
    level: 'error',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple()
            )
        }),
        new transports.File({ filename: 'error.log', level: 'error' })
    ]
});

// Middleware for handling not found routes
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Middleware for handling errors
const errorHandler = (err, req, res, next) => {
    logger.error('Error: %o', err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode);

    const errorResponse = {
        success: false,
        message: err.message || 'An unexpected error occurred.'
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.json(errorResponse);
};

export { errorHandler, notFound };
