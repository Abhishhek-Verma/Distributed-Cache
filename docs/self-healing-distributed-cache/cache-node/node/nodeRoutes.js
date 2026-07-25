'use strict';

const express = require('express');
const nodeInfo = require('./nodeInfo');
const cacheEngine = require('../cache/cacheEngine');

const router = express.Router();

// ─── GET /api/v1/node/info ────────────────────────────────────────────────────

/**
 * Return the full CacheNode record for this node.
 *
 * This endpoint serves two purposes:
 *   1. Phase 3 — Verify each node is independently running and correctly
 *      identified (id, host, port, status).
 *   2. Phase 4 — The Cluster Manager will call this endpoint when registering
 *      a node into the cluster to retrieve node metadata.
 *
 * Response includes the complete CacheNode model from Architecture.md plus
 * a real-time snapshot of current cache utilization.
 *
 * Follows: Architecture.md — CacheNode data model.
 * Follows: Rules.md Rule 2 — route only receives, delegates, returns.
 *
 * @returns {200} { success, data: { id, host, port, status, role, lastHeartbeat, startedAt, cacheSize, maxCacheSize } }
 */
router.get('/info', (req, res, next) => {
  try {
    const info = nodeInfo.getNodeInfo();
    const stats = cacheEngine.getStats();

    return res.status(200).json({
      success: true,
      data: {
        id: info.id,
        host: info.host,
        port: info.port,
        status: info.status,
        role: info.role,
        lastHeartbeat: info.lastHeartbeat,
        startedAt: info.startedAt,
        cacheSize: stats.size,
        maxCacheSize: stats.maxSize,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
