// src/server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Middlewares (ab src ke andar se relative path)
const errorHandler = require('./middleware/error.middleware');
const logger = require('./middleware/logger.middleware');
const { protect } = require('./middleware/auth.middleware');

// Routes (src ke andar se)
const authRoutes = require('./routes/auth.routes');

// Prisma Client
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Express app
const app = express();

// Middleware stack
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(logger);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'DevOps Agent Backend is running',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to DevOps Agent Hackathon Backend!',
    version: '1.0.0',
    status: 'online',
  });
});

// Routes
app.use('/api/auth', authRoutes);

// Protected routes (jab agent endpoint banayega tab yahan add karna)
// app.use('/api/agent', protect, require('./routes/agent.routes'));

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Global error handler – last mein
app.use(errorHandler);

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down...`);
  try {
    await prisma.$disconnect();
    console.log('Prisma disconnected');
    process.exit(0);
  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

module.exports = app;