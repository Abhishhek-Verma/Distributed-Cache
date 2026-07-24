'use strict';

const express = require('express');
const cacheEngine = require('./cacheEngine');
const replicationService = require('../replication/replicationService');
const metricsService = require('../monitoring/metricsService');

const router = express.Router();

// ─── POST /api/v1/cache ───────────────────────────────────────────────────────

/**
 * Store a cache entry on this node.
 *
 * Request body:
 *   { key: string, value: any, ttl?: number }
 *
 * Responses:
 *   201 — entry stored successfully
 *   400 — validation failure (missing key/value, invalid TTL)
 *   507 — cache node is full (MAX_CACHE_SIZE reached)
 *
 * Follows: API.md §5.1 — Store Cache Entry.
 * Follows: Rules.md Rule 2 — route only receives, validates, delegates, returns.
 */
router.post('/', async (req, res, next) => {
  metricsService.incrementRequests();
  try {
    const { key, value, ttl } = req.body;

    // Basic presence check before delegating to the engine
    if (key === undefined || key === null) {
      return res.status(400).json({ success: false, message: 'Cache key is required' });
    }
    if (value === undefined || value === null) {
      return res.status(400).json({ success: false, message: 'Cache value is required' });
    }

    const result = cacheEngine.setEntry(key, value, ttl);

    if (!result.success) {
      return res.status(result.statusCode).json({ success: false, message: result.error });
    }

    // Phase 6: Synchronous Replication
    const isReplicaRequest = req.headers['x-is-replica'] === 'true';
    const replicaUrl = req.headers['x-replica-url'];

    if (!isReplicaRequest && replicaUrl) {
      const replResult = await replicationService.replicate(replicaUrl, 'POST', req.body);
      
      if (!replResult.success) {
        // Rollback: do not retain partially written entry if replication fails (Rules.md §10.8)
        cacheEngine.deleteEntry(key);
        return res.status(503).json({
          success: false,
          message: 'Replication failed: replica node unreachable',
        });
      }
    }

    return res.status(201).json({ success: true, message: 'Cache stored successfully' });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/cache/_export ────────────────────────────────────────────────

/**
 * Export all non-expired cache entries.
 * Used by Cluster Manager during Phase 8 Recovery/Self-Healing.
 */
router.get('/_export', (req, res, next) => {
  metricsService.incrementRequests();
  try {
    const entries = cacheEngine.exportEntries();
    return res.status(200).json({ success: true, data: entries });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/cache/:key ───────────────────────────────────────────────────

/**
 * Retrieve a cache entry by key.
 *
 * Responses:
 *   200 — entry found, returns { key, value }
 *   400 — invalid key format
 *   404 — key not found or expired
 *
 * Follows: API.md §5.2 — Get Cache Entry.
 */
router.get('/:key', (req, res, next) => {
  metricsService.incrementRequests();
  try {
    const { key } = req.params;

    const result = cacheEngine.getEntry(key);

    if (!result.success) {
      metricsService.incrementMisses();
      return res.status(result.statusCode).json({ success: false, message: result.error });
    }

    metricsService.incrementHits();
    return res.status(200).json({ success: true, data: result.data });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/v1/cache/:key ────────────────────────────────────────────────

/**
 * Delete a cache entry by key.
 *
 * Responses:
 *   200 — entry deleted
 *   400 — invalid key format
 *   404 — key not found or already expired
 *
 * Follows: API.md §5.3 — Delete Cache Entry.
 */
router.delete('/:key', async (req, res, next) => {
  metricsService.incrementRequests();
  try {
    const { key } = req.params;

    const result = cacheEngine.deleteEntry(key);

    if (!result.success) {
      return res.status(result.statusCode).json({ success: false, message: result.error });
    }

    // Phase 6: Synchronous Replication for Deletes
    const isReplicaRequest = req.headers['x-is-replica'] === 'true';
    const replicaUrl = req.headers['x-replica-url'];

    if (!isReplicaRequest && replicaUrl) {
      const replResult = await replicationService.replicate(replicaUrl, 'DELETE');
      
      if (!replResult.success && replResult.statusCode !== 404) {
        // If replica delete fails (excluding 404 which is fine), return error
        return res.status(503).json({
          success: false,
          message: 'Replication failed: replica node unreachable',
        });
      }
    }

    return res.status(200).json({ success: true, message: 'Cache entry deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
