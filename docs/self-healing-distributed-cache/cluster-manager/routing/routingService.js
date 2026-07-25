'use strict';

const nodeRegistryService = require('../node-manager/nodeRegistryService');
const hashRing = require('./hashRing');

/**
 * RoutingService
 *
 * Responsibility: Determine which cache node should handle a given request.
 *
 * Phase 5 strategy: Consistent hashing using a SHA-256 ring with 
 * virtual nodes per physical node.
 *
 * Follows: Architecture.md — Cluster Manager routing responsibilities.
 * Follows: Rules.md Rule 1 — Single Responsibility.
 */

/**
 * Find the primary and replica nodes that should handle the given cache key.
 *
 * Phase 6: Uses consistent hash ring lookup to find primary and replica.
 *
 * @param {string} key - Cache key to route
 * @returns {{ success: boolean, primaryNode?: Object, replicaNode?: Object, error?: string, statusCode?: number }}
 */
function findNodesForKey(key) {
  const activeNodes = nodeRegistryService.getActiveNodes();

  if (activeNodes.length === 0) {
    console.warn(
      `[${new Date().toISOString()}] [cluster-manager] [routing] No active nodes — cannot route key="${key}"`
    );
    return {
      success: false,
      error: 'No cache nodes are currently available',
      statusCode: 503,
    };
  }

  // Phase 5 & 6: Consistent hash ring lookup for primary and replica
  const { primary, replica } = hashRing.getNodesForKey(key);
  
  // Find the full node objects from active nodes
  const primaryNode = activeNodes.find(n => n.id === primary);
  const replicaNode = replica ? activeNodes.find(n => n.id === replica) : null;

  if (!primaryNode) {
     return {
      success: false,
      error: 'Failed to route key to an active primary node',
      statusCode: 500,
    };
  }

  console.log(
    `[${new Date().toISOString()}] [cluster-manager] [routing] Routed key="${key}" → primary=${primaryNode.id}, replica=${replicaNode ? replicaNode.id : 'none'}`
  );

  return { success: true, primaryNode, replicaNode };
}

/**
 * Return all currently active (ONLINE) nodes.
 * Used by routes that need the full list (e.g., fan-out operations).
 * @returns {Object[]}
 */
function getActiveNodes() {
  return nodeRegistryService.getActiveNodes();
}

module.exports = { findNodesForKey, getActiveNodes };


