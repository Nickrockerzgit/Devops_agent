// src/middlewares/error.middleware.js
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Console mein detailed log (debug ke liye)
  console.error('ERROR DETAILS:', {
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
    user: req.user ? req.user.email : 'anonymous',
  });

  res.status(statusCode).json({
    success: false,
    error: message,
    // Development mein stack dikhao, production mein mat
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;