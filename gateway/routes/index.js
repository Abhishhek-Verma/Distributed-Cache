'use strict';

const express = require('express');

const router = express.Router();

/**
 * GET /api/v1/health
 * Health check endpoint.
 * Returns service status and timestamp.
 * Follows API.md Section 7.1 — Health Check.
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
