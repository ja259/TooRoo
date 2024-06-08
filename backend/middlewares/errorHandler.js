// middlewares/errorHandler.js

/**
 * Error handling middleware for express applications.
 * This middleware will capture any errors passed through the 'next()' function
 * in your routes or any errors thrown within your asynchronous route handlers.
 * It logs the error and sends a formatted response to the client.
 */
module.exports = (err, req, res, next) => {
    // Log the error to the server's console
    console.error(`Error: ${err.status} - ${err.message}`);

    // Determine if the error includes a status code and set it, default to 500 if not provided
    const statusCode = err.status || 500;

    // Respond to the client with the error information, but don't include the stack in production
    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected error occurred.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace only in development mode for debugging
    });
};
