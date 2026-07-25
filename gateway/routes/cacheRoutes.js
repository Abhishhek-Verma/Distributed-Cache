'use strict';

const express = require('express');
const clusterClient = require('../services/clusterClient');
const config = require('../config');
const logService = require('../services/logService');

const router = express.Router();

// ─── POST /api/v1/cache ───────────────────────────────────────────────────────

/**
 * Accept a cache SET request and forward it to the Cluster Manager.
 *
 * The Gateway validates that key and value are present before forwarding.
 * Full field-level validation (TTL range, key length, value type) is
 * performed by the cache node engine (cacheEngine.js) per Phase 2.
 *
 * Follows: API.md §5.1 — Store Cache Entry.
 * Follows: Rules.md Rule 2 — route only receives, validates, delegates, returns.
 *
 * @returns {201} Cache stored successfully
 * @returns {400} Missing key or value
 * @returns {503} Cluster Manager or cache nodes unavailable
 */
router.post('/', async (req, res, next) => {
  try {
    const { key, value } = req.body || {};

    if (!key) {
      return res.status(400).json({ success: false, message: 'Cache key is required' });
    }
    if (value === undefined || value === null) {
      return res.status(400).json({ success: false, message: 'Cache value is required' });
    }

    console.log(`[${new Date().toISOString()}] [gateway] SET key="${key}" → cluster-manager`);
    logService.addLog('INFO', 'gateway', `SET cache key="${key}" forwarded to cluster manager`);

    const result = await clusterClient.setCache(req.body);
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [gateway] Cluster Manager unreachable: ${err.message}`);
    next({ status: 503, message: `Cluster Manager is unavailable: ${err.message}` });
  }
});

// ─── GET /api/v1/cache/_export ────────────────────────────────────────────────

/**
 * Forward a cache export request to the Cluster Manager.
 *
 * @returns {200} { success: true, data: CacheEntry[] }
 * @returns {503} Cluster Manager unavailable
 */
router.get('/_export', async (req, res, next) => {
  try {
    console.log(`[${new Date().toISOString()}] [gateway] EXPORT all entries → cluster-manager`);
    const result = await clusterClient.exportCache();
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [gateway] Cluster Manager unreachable: ${err.message}`);
    next({ status: 503, message: `Cluster Manager is unavailable: ${err.message}` });
  }
});

// ─── GET /api/v1/cache/:key ───────────────────────────────────────────────────

/**
 * Accept a cache GET request and forward it to the Cluster Manager.
 *
 * Follows: API.md §5.2 — Get Cache Entry.
 *
 * @returns {200} { success, data: { key, value } }
 * @returns {404} Key not found or expired
 * @returns {503} Cluster Manager unavailable
 */
router.get('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;

    console.log(`[${new Date().toISOString()}] [gateway] GET key="${key}" → cluster-manager`);

    const result = await clusterClient.getCache(key);
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [gateway] Cluster Manager unreachable: ${err.message}`);
    next({ status: 503, message: `Cluster Manager is unavailable: ${err.message}` });
  }
});

// ─── DELETE /api/v1/cache/:key ────────────────────────────────────────────────

/**
 * Accept a cache DELETE request and forward it to the Cluster Manager.
 *
 * Follows: API.md §5.3 — Delete Cache Entry.
 *
 * @returns {200} { success, message: 'Cache entry deleted' }
 * @returns {404} Key not found
 * @returns {503} Cluster Manager unavailable
 */
router.delete('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;

    console.log(`[${new Date().toISOString()}] [gateway] DELETE key="${key}" → cluster-manager`);

    const result = await clusterClient.deleteCache(key);
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [gateway] Cluster Manager unreachable: ${err.message}`);
    next({ status: 503, message: `Cluster Manager is unavailable: ${err.message}` });
  }
});

module.exports = router;
