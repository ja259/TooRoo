const errorHandler = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong in the application.';
    console.error('Error:', err);
    res.status(status).json({ success: false, message: message });
  };
  
  module.exports = errorHandler;
  