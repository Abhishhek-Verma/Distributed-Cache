'use strict';

const express = require('express');
const cacheRoutes = require('./cacheRoutes');
const clusterRoutes = require('./clusterRoutes');

const router = express.Router();

/**
 * GET /api/v1/health
 * Gateway health check endpoint.
 * Follows API.md Section 7.1.
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'gateway',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Cache CRUD routes — Phase 4 (proxied to Cluster Manager).
 * POST   /api/v1/cache        → SET
 * GET    /api/v1/cache/:key   → GET
 * DELETE /api/v1/cache/:key   → DELETE
 * Follows API.md §5.
 */
router.use('/cache', cacheRoutes);

/**
 * Cluster management routes — Phase 4 (proxied to Cluster Manager).
 * GET    /api/v1/cluster              → cluster info
 * GET    /api/v1/cluster/nodes        → list nodes
 * POST   /api/v1/cluster/nodes        → register node
 * DELETE /api/v1/cluster/nodes/:id    → remove node
 * Follows API.md §6.
 */
router.use('/cluster', clusterRoutes);

module.exports = router;
