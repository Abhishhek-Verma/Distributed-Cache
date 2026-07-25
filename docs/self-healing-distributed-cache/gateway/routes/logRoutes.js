'use strict';

const express = require('express');
const logService = require('../services/logService');

const router = express.Router();

/**
 * GET /api/v1/logs
 * Retrieve recent backend system log entries.
 */
router.get('/', (req, res) => {
  const logs = logService.getLogs();
  res.status(200).json({
    success: true,
    data: logs,
  });
});

module.exports = router;
