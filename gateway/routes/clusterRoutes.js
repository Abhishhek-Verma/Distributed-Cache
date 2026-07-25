'use strict';

const express = require('express');
const clusterClient = require('../services/clusterClient');

const router = express.Router();

// ─── GET /api/v1/cluster ──────────────────────────────────────────────────────

/**
 * Forward cluster status request to the Cluster Manager.
 * Follows: API.md §6.1 — Get Cluster Information.
 *
 * @returns {200} { success, data: { totalNodes, healthyNodes, failedNodes, replicationFactor } }
 * @returns {503} Cluster Manager unavailable
 */
router.get('/', async (req, res, next) => {
  try {
    const result = await clusterClient.getClusterInfo();
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next({ status: 503, message: `Cluster Manager is unavailable: ${err.message}` });
  }
});

// ─── GET /api/v1/cluster/nodes ────────────────────────────────────────────────

/**
 * Forward list-nodes request to the Cluster Manager.
 * Follows: API.md §6.2 — List Cache Nodes.
 *
 * @returns {200} { success, data: CacheNode[] }
 * @returns {503} Cluster Manager unavailable
 */
router.get('/nodes', async (req, res, next) => {
  try {
    const result = await clusterClient.getClusterNodes();
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next({ status: 503, message: `Cluster Manager is unavailable: ${err.message}` });
  }
});

// ─── POST /api/v1/cluster/nodes ───────────────────────────────────────────────

/**
 * Forward node registration request to the Cluster Manager.
 * Follows: API.md §6.3 — Register Cache Node.
 *
 * @returns {201} { success, message: 'Node registered successfully' }
 * @returns {400} Missing/invalid fields
 * @returns {503} Cluster Manager unavailable
 */
router.post('/nodes', async (req, res, next) => {
  try {
    const { id, host, port } = req.body || {};

    if (!id || !host || port === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Node id, host, and port are required',
      });
    }

    const result = await clusterClient.registerNode({ id, host, port });
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next({ status: 503, message: `Cluster Manager is unavailable: ${err.message}` });
  }
});

// ─── DELETE /api/v1/cluster/nodes/:id ────────────────────────────────────────

/**
 * Forward node removal request to the Cluster Manager.
 * Follows: API.md §6.4 — Remove Cache Node.
 *
 * @returns {200} { success, message: 'Node removed successfully' }
 * @returns {404} Node not found
 * @returns {503} Cluster Manager unavailable
 */
router.delete('/nodes/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await clusterClient.removeNode(id);
    return res.status(result.statusCode).json(result.data);
  } catch (err) {
    next({ status: 503, message: `Cluster Manager is unavailable: ${err.message}` });
  }
});

module.exports = router;
