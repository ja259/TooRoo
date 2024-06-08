// Error handling middleware for Express applications
module.exports = (err, req, res, next) => {
    console.error('Error:', err);

    const statusCode = err.statusCode || 500; // Use statusCode if available, or default to 500

    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected error occurred.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Include stack trace in development only
    });
};
