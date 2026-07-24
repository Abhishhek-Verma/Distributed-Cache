'use strict';

const express = require('express');
const cacheEngine = require('./cacheEngine');

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
router.post('/', (req, res, next) => {
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

    return res.status(201).json({ success: true, message: 'Cache stored successfully' });
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
  try {
    const { key } = req.params;

    const result = cacheEngine.getEntry(key);

    if (!result.success) {
      return res.status(result.statusCode).json({ success: false, message: result.error });
    }

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
router.delete('/:key', (req, res, next) => {
  try {
    const { key } = req.params;

    const result = cacheEngine.deleteEntry(key);

    if (!result.success) {
      return res.status(result.statusCode).json({ success: false, message: result.error });
    }

    return res.status(200).json({ success: true, message: 'Cache entry deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
