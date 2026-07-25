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

    const routing = routingService.findNodesForKey(key);
    if (!routing.success) {
      return res.status(routing.statusCode).json({ success: false, message: routing.error });
    }

    const { primaryNode, replicaNode } = routing;
    const customHeaders = {};

    if (replicaNode) {
      customHeaders['x-replica-url'] = `http://${replicaNode.host}:${replicaNode.port}/api/v1/cache`;
    }

    const result = await requestForwarder.forwardToNode(
      primaryNode,
      'POST',
      '/api/v1/cache',
      req.body,
      customHeaders
    );

    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/cache/_export ────────────────────────────────────────────────

/**
 * Export all non-expired cache entries from all active nodes in the cluster.
 * Aggregates entries across physical nodes.
 *
 * @returns {200} { success: true, data: CacheEntry[] }
 */
router.get('/_export', async (req, res, next) => {
  try {
    const nodeRegistryService = require('../node-manager/nodeRegistryService');
    const nodes = nodeRegistryService.getAllNodes().filter(n => n.status === 'ONLINE');

    if (nodes.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const allEntriesMap = new Map();

    for (const node of nodes) {
      const result = await requestForwarder.forwardToNode(node, 'GET', '/api/v1/cache/_export');
      if (result.success && Array.isArray(result.data?.data)) {
        for (const entry of result.data.data) {
          if (!allEntriesMap.has(entry.key)) {
            allEntriesMap.set(entry.key, entry);
          }
        }
      }
    }

    return res.status(200).json({
      success: true,
      data: Array.from(allEntriesMap.values()),
    });
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

    const routing = routingService.findNodesForKey(key);
    if (!routing.success) {
      return res.status(routing.statusCode).json({ success: false, message: routing.error });
    }

    const { primaryNode, replicaNode } = routing;

    let result = await requestForwarder.forwardToNode(
      primaryNode,
      'GET',
      `/api/v1/cache/${encodeURIComponent(key)}`
    );

    // Phase 6: Read from replica if primary is unavailable
    if (!result.success && result.statusCode === 503 && replicaNode) {
      console.log(`[${new Date().toISOString()}] [cluster-manager] [proxy] Primary ${primaryNode.id} unavailable for GET "${key}", trying replica ${replicaNode.id}`);
      result = await requestForwarder.forwardToNode(
        replicaNode,
        'GET',
        `/api/v1/cache/${encodeURIComponent(key)}`
      );
    }

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

    const routing = routingService.findNodesForKey(key);
    if (!routing.success) {
      return res.status(routing.statusCode).json({ success: false, message: routing.error });
    }

    const { primaryNode, replicaNode } = routing;
    const customHeaders = {};

    if (replicaNode) {
      customHeaders['x-replica-url'] = `http://${replicaNode.host}:${replicaNode.port}/api/v1/cache/${encodeURIComponent(key)}`;
    }

    const result = await requestForwarder.forwardToNode(
      primaryNode,
      'DELETE',
      `/api/v1/cache/${encodeURIComponent(key)}`,
      undefined,
      customHeaders
    );

    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
