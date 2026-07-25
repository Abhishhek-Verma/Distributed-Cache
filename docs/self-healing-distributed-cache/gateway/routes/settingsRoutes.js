'use strict';

const express = require('express');
const settingsService = require('../services/settingsService');
const logService = require('../services/logService');

const router = express.Router();

/**
 * GET /api/v1/settings
 * Retrieve current configuration settings.
 */
router.get('/', (req, res) => {
  const current = settingsService.getSettings();
  res.status(200).json({
    success: true,
    data: current,
  });
});

/**
 * PUT /api/v1/settings
 * Update configuration settings.
 */
router.put('/', (req, res) => {
  const updated = settingsService.updateSettings(req.body);
  logService.addLog('INFO', 'gateway', `Settings updated: pollingInterval=${updated.pollingInterval}ms, memThreshold=${updated.memThreshold}%`);
  res.status(200).json({
    success: true,
    message: 'Settings saved successfully',
    data: updated,
  });
});

module.exports = router;
