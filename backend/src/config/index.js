// src/config/index.js
require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-key-change-this-123",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  
  // OTP Configuration
  OTP_EXPIRES_IN: parseInt(process.env.OTP_EXPIRES_IN) || 5 * 60 * 1000, // 5 minutes
  
  // Email Configuration (NodeMailer)
  EMAIL: {
    HOST: process.env.MAIL_HOST || "smtp.gmail.com",
    PORT: parseInt(process.env.MAIL_PORT) || 587,
    USER: process.env.MAIL_USER,
    PASS: process.env.MAIL_PASS,
    FROM: process.env.MAIL_FROM || "DevOps Agent <noreply@devops.com>",
  },
  
  // OpenAI Configuration
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Agent Configuration
  AGENT_RETRY_LIMIT: parseInt(process.env.AGENT_RETRY_LIMIT) || 5,
  
  // GitHub Configuration
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL: process.env.GITHUB_CALLBACK_URL,
};


