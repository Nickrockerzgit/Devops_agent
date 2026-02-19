// src/routes/agent.routes.js
const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { runAgent } = require('../controller/agent.controller');

const router = express.Router();

// Protected route - requires authentication
router.post('/run', protect, runAgent);

module.exports = router;