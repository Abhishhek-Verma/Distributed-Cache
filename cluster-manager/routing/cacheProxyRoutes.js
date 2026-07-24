'use strict';

const express = require('express');
const routingService = require('./routingService');
const requestForwarder = require('./requestForwarder');

const router = express.Router();

// ─── POST /api/v1/cache ───────────────────────────────────────────────────────

/**
 * Proxy a SET (cache write) request to the appropriate cache node.
 *
 * Flow:
 *   1. Validate request body presence
 *   2. Ask routingService which node owns this key (Phase 4: first-available)
 *   3. Forward POST /api/v1/cache to that node via requestForwarder
 *   4. Return the node's response to the caller
 *
 * Note: In Phase 6 (Replication), this route will also trigger a synchronous
 * replication write to the replica node after a successful primary write.
 *
 * Follows: API.md §5.1 — Store Cache Entry.
 * Follows: Rules.md Rule 2 — routes only receive, validate, delegate, return.
 *
 * @returns {201} Cache stored successfully (forwarded from node)
 * @returns {400} Validation error
 * @returns {503} No nodes available
 */
router.post('/', async (req, res, next) => {
  try {
    const { key, value } = req.body;

    if (!key) {
      return res.status(400).json({ success: false, message: 'Cache key is required' });
    }
    if (value === undefined || value === null) {
      return res.status(400).json({ success: false, message: 'Cache value is required' });
    }

    const routing = routingService.findNodeForKey(key);
    if (!routing.success) {
      return res.status(routing.statusCode).json({ success: false, message: routing.error });
    }

    const result = await requestForwarder.forwardToNode(
      routing.node,
      'POST',
      '/api/v1/cache',
      req.body
    );

    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/cache/:key ───────────────────────────────────────────────────

/**
 * Proxy a GET (cache read) request to the appropriate cache node.
 *
 * Follows: API.md §5.2 — Get Cache Entry.
 *
 * @returns {200} { success, data: { key, value } }
 * @returns {404} Entry not found or expired
 * @returns {503} No nodes available
 */
router.get('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;

    const routing = routingService.findNodeForKey(key);
    if (!routing.success) {
      return res.status(routing.statusCode).json({ success: false, message: routing.error });
    }

    const result = await requestForwarder.forwardToNode(
      routing.node,
      'GET',
      `/api/v1/cache/${encodeURIComponent(key)}`
    );

    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/v1/cache/:key ────────────────────────────────────────────────

/**
 * Proxy a DELETE (cache eviction) request to the appropriate cache node.
 *
 * Note: In Phase 6 (Replication), this route will also send DELETE to the
 * replica node per Rules.md Rule 8 — every delete must remove primary and replica.
 *
 * Follows: API.md §5.3 — Delete Cache Entry.
 *
 * @returns {200} { success, message: 'Cache entry deleted' }
 * @returns {404} Entry not found
 * @returns {503} No nodes available
 */
router.delete('/:key', async (req, res, next) => {
  try {
    const { key } = req.params;

    const routing = routingService.findNodeForKey(key);
    if (!routing.success) {
      return res.status(routing.statusCode).json({ success: false, message: routing.error });
    }

    const result = await requestForwarder.forwardToNode(
      routing.node,
      'DELETE',
      `/api/v1/cache/${encodeURIComponent(key)}`
    );

    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
