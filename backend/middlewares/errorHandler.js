const { createLogger, transports, format } = require('winston');

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

module.exports = (err, req, res, next) => {
    logger.error('Error: %o', err);

    const statusCode = err.statusCode || 500;

    const errorResponse = {
        success: false,
        message: err.message || 'An unexpected error occurred.'
    };

    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(statusCode).json(errorResponse);
};
