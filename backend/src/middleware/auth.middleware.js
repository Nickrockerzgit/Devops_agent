// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const protect = (req, res, next) => {
  let token;

  // Token Bearer header se le
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized - No token provided',
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { userId, email, teamName, ... } – future routes mein use kar sakta hai
    next();
  } catch (err) {
    console.error('JWT Error:', err.message);
    return res.status(401).json({
      success: false,
      error: 'Not authorized - Invalid or expired token',
    });
  }
};

// Role-based restriction (agar leader/judge alag permissions chahiye)
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role || 'leader')) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Insufficient permissions',
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };