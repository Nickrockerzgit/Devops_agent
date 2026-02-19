// src/config/index.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-key-change-this-123",
  JWT_EXPIRES_IN: "7d",
  OTP_EXPIRES_IN: 5 * 60 * 1000, // 5 minutes
  EMAIL: {
    USER: process.env.EMAIL_USER,
    PASS: process.env.EMAIL_PASS,
    HOST: "smtp.gmail.com",
    PORT: 587,
  },
};


