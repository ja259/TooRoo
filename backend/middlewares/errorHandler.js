const { createLogger, transports, format } = require('winston');

// Configure the logger
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
        new transports.File({ filename: 'error.log' })
    ]
});

module.exports = (err, req, res, next) => {
    // Log the error using the configured logger
    logger.error('Error: %o', err);

    // Determine the status code to respond with
    const statusCode = err.statusCode || 500;

    // Create the error response object
    const errorResponse = {
        success: false,
        message: err.message || 'An unexpected error occurred.'
    };

    // Include stack trace in development mode
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    // Send the error response
    res.status(statusCode).json(errorResponse);
};
