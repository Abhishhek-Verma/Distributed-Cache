'use strict';

const express = require('express');
const nodeRegistryService = require('../node-manager/nodeRegistryService');
const recoveryService = require('../node-manager/recoveryService');
const rebalancingService = require('../node-manager/rebalancingService');

const router = express.Router();

// ─── GET /api/v1/cluster ──────────────────────────────────────────────────────

/**
 * Get overall cluster status.
 *
 * Returns summary of total, healthy, and failed nodes plus replication factor.
 * Follows API.md §6.1 — Get Cluster Information.
 * Follows Rules.md Rule 2 — routes only receive, delegate, return.
 *
 * @returns {200} { success, data: { totalNodes, healthyNodes, failedNodes, replicationFactor } }
 */
router.get('/', (req, res, next) => {
  try {
    const info = nodeRegistryService.getClusterInfo();
    return res.status(200).json({ success: true, data: info });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/v1/cluster/nodes ────────────────────────────────────────────────

/**
 * List all registered cache nodes.
 *
 * Follows API.md §6.2 — List Cache Nodes.
 *
 * @returns {200} { success, data: CacheNode[] }
 */
router.get('/nodes', (req, res, next) => {
  try {
    const nodes = nodeRegistryService.getAllNodes();
    return res.status(200).json({ success: true, data: nodes });
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/v1/cluster/nodes ───────────────────────────────────────────────

/**
 * Register a cache node with the cluster.
 *
 * Request body: { id: string, host: string, port: number }
 *
 * Handles both initial registration and node re-join after failure.
 * Follows API.md §6.3 — Register Cache Node.
 *
 * @returns {201} { success, message }
 * @returns {400} { success: false, message } — missing/invalid fields
 */
router.post('/nodes', (req, res, next) => {
  try {
    const { id, host, port } = req.body;

    if (!id && !host && !port) {
      return res.status(400).json({
        success: false,
        message: 'Request body must contain id, host, and port',
      });
    }

    const result = nodeRegistryService.registerNode({ id, host, port });

    if (!result.success) {
      return res.status(result.statusCode).json({ success: false, message: result.error });
    }

    // Phase 9: Trigger cluster rebalancing on node join
    rebalancingService.rebalanceCluster();

    return res.status(201).json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/v1/cluster/nodes/:id ────────────────────────────────────────

/**
 * Remove a cache node from the cluster registry.
 *
 * Follows API.md §6.4 — Remove Cache Node.
 *
 * @returns {200} { success, message }
 * @returns {404} { success: false, message } — node not found
 */
router.delete('/nodes/:id', (req, res, next) => {
  try {
    const { id } = req.params;

    const result = nodeRegistryService.removeNode(id);

    if (!result.success) {
      return res.status(result.statusCode).json({ success: false, message: result.error });
    }

    // Phase 9: Trigger cluster rebalancing on graceful node removal
    rebalancingService.rebalanceCluster();

    return res.status(200).json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
