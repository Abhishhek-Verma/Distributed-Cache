'use strict';

const axios = require('axios');
const nodeRegistryService = require('./nodeRegistryService');
const routingService = require('../routing/routingService');
const requestForwarder = require('../routing/requestForwarder');

/**
 * Tracks which nodes are currently undergoing recovery to prevent
 * duplicate concurrent recovery operations for the same node.
 */
const recoveringNodes = new Set();

/**
 * Perform self-healing recovery after a node failure.
 *
 * Follows Phase 8 Requirements:
 * - Detect affected key ranges.
 * - Restore configured replication factor.
 * - Reassign ownership via existing hash ring.
 * - Only move affected keys (never migrate the entire cache).
 *
 * @param {string} failedNodeId
 */
async function recoverNode(failedNodeId) {
  if (recoveringNodes.has(failedNodeId)) {
    return;
  }
  recoveringNodes.add(failedNodeId);

  console.log(`[${new Date().toISOString()}] [cluster-manager] [recovery] START: Recovering from failure of ${failedNodeId}`);

  try {
    const activeNodes = nodeRegistryService.getActiveNodes();
    
    if (activeNodes.length === 0) {
      console.warn(`[${new Date().toISOString()}] [cluster-manager] [recovery] No active nodes available for recovery.`);
      return;
    }

    // Step 1: Export all keys from all currently active nodes
    const allKeys = new Map(); // K -> { value, ttl }
    const keyOwners = new Map(); // K -> Set<string> (node IDs)

    for (const node of activeNodes) {
      try {
        const url = `http://${node.host}:${node.port}/api/v1/cache/_export`;
        const res = await axios.get(url, { validateStatus: () => true, timeout: 10000 });
        
        if (res.status === 200 && res.data && res.data.success) {
          const entries = res.data.data;
          for (const entry of entries) {
            allKeys.set(entry.key, entry);
            if (!keyOwners.has(entry.key)) {
              keyOwners.set(entry.key, new Set());
            }
            keyOwners.get(entry.key).add(node.id);
          }
        }
      } catch (err) {
        console.warn(`[${new Date().toISOString()}] [cluster-manager] [recovery] Failed to export from node ${node.id}: ${err.message}`);
      }
    }

    // Step 2: Determine affected keys and synchronize data
    // We only migrate keys to nodes that SHOULD have them but currently DO NOT.
    let syncCount = 0;

    for (const [key, entry] of allKeys.entries()) {
      const routing = routingService.findNodesForKey(key);
      if (!routing.success) continue;

      const { primaryNode, replicaNode } = routing;
      const owners = keyOwners.get(key);
      let migrated = false;

      // Check if primary needs this key
      if (primaryNode && !owners.has(primaryNode.id)) {
        console.log(`[${new Date().toISOString()}] [cluster-manager] [recovery] Re-assigning key "${key}" to new primary ${primaryNode.id}`);
        await requestForwarder.forwardToNode(primaryNode, 'POST', '/api/v1/cache', entry, { 'x-is-replica': 'true' });
        migrated = true;
      }

      // Check if replica needs this key (Restoring Replication Factor)
      if (replicaNode && !owners.has(replicaNode.id)) {
        console.log(`[${new Date().toISOString()}] [cluster-manager] [recovery] Re-assigning key "${key}" to new replica ${replicaNode.id}`);
        await requestForwarder.forwardToNode(replicaNode, 'POST', '/api/v1/cache', entry, { 'x-is-replica': 'true' });
        migrated = true;
      }

      if (migrated) syncCount++;
    }

    console.log(`[${new Date().toISOString()}] [cluster-manager] [recovery] COMPLETE: ${failedNodeId} recovered. Synchronized ${syncCount} affected keys.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [cluster-manager] [recovery] ERROR during recovery of ${failedNodeId}: ${err.message}`);
  } finally {
    recoveringNodes.delete(failedNodeId);
  }
}

module.exports = { recoverNode };
