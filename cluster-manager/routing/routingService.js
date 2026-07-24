'use strict';

const nodeRegistryService = require('../node-manager/nodeRegistryService');

/**
 * RoutingService
 *
 * Responsibility: Determine which cache node should handle a given request.
 *
 * Phase 4 strategy: Returns the first available ONLINE node.
 * This is an intentional placeholder that enables end-to-end testing
 * of the full request pipeline (Gateway → Cluster Manager → Cache Node)
 * without consistent hashing.
 *
 * Phase 5 will replace `findNodeForKey()` with a SHA-256 consistent hash ring
 * (150 virtual nodes per physical node) WITHOUT changing the public interface
 * of this module. Only the internal selection algorithm changes.
 *
 * Follows: Architecture.md — Cluster Manager routing responsibilities.
 * Follows: Rules.md Rule 1 — Single Responsibility.
 */

/**
 * Find the cache node that should handle the given cache key.
 *
 * Phase 4: Returns the first ONLINE node from the registry.
 * Phase 5: This function will be replaced with consistent hash ring lookup.
 *
 * @param {string} key - Cache key to route
 * @returns {{ success: boolean, node?: Object, error?: string, statusCode?: number }}
 */
function findNodeForKey(key) {
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

  // Phase 4: simple first-available selection
  // Phase 5 replaces this block with: hashRing.getNodeForKey(key)
  const selectedNode = activeNodes[0];

  console.log(
    `[${new Date().toISOString()}] [cluster-manager] [routing] Routed key="${key}" → node=${selectedNode.id} (Phase 4 first-available)`
  );

  return { success: true, node: selectedNode };
}

/**
 * Return all currently active (ONLINE) nodes.
 * Used by routes that need the full list (e.g., fan-out operations).
 * @returns {Object[]}
 */
function getActiveNodes() {
  return nodeRegistryService.getActiveNodes();
}

module.exports = { findNodeForKey, getActiveNodes };
