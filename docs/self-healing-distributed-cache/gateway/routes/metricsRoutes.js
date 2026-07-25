'use strict';

const express = require('express');
const prometheusService = require('../services/prometheusService');

const router = express.Router();

/**
 * GET /api/v1/metrics/overview
 * Returns current snapshot of cluster Prometheus metrics.
 */
router.get('/overview', async (req, res) => {
  try {
    const data = await prometheusService.getOverview();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Failed to query Prometheus overview:', err.message);
    return res.status(503).json({
      success: false,
      message: 'Unable to retrieve Prometheus metrics.',
      error: err.message
    });
  }
});

/**
 * GET /api/v1/metrics/range
 * Returns historical time-series metric data for charts.
 */
router.get('/range', async (req, res) => {
  try {
    const data = await prometheusService.getRangeData();
    return res.status(200).json({
      success: true,
      data
    });
  } catch (err) {
    console.error('Failed to query Prometheus range:', err.message);
    return res.status(503).json({
      success: false,
      message: 'Unable to retrieve Prometheus metrics.',
      error: err.message
    });
  }
});

module.exports = router;
