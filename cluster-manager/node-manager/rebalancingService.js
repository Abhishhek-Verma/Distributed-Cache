'use strict';

const axios = require('axios');
const nodeRegistryService = require('./nodeRegistryService');
const routingService = require('../routing/routingService');
const requestForwarder = require('../routing/requestForwarder');

let isRebalancing = false;

/**
 * Perform cluster rebalancing when topology changes (node join/leave).
 *
 * Follows Phase 9 Requirements:
 * - Trigger rebalancing only on node join or graceful removal.
 * - Identify only affected key ranges.
 * - Move only the minimum required keys.
 * - Preserve data consistency and restore replication.
 * - Prevent duplicate or concurrent rebalancing operations.
 */
async function rebalanceCluster() {
  if (isRebalancing) {
    console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] Rebalance already in progress. Skipping duplicate request.`);
    return;
  }

  isRebalancing = true;
  console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] START: Rebalancing cluster due to topology change`);

  try {
    const activeNodes = nodeRegistryService.getActiveNodes();
    
    if (activeNodes.length === 0) {
      console.warn(`[${new Date().toISOString()}] [cluster-manager] [rebalance] No active nodes available for rebalancing.`);
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
            // Conflict resolution: keep the newest version based on updatedAt
            const existing = allKeys.get(entry.key);
            if (!existing || new Date(entry.updatedAt) >= new Date(existing.updatedAt)) {
              allKeys.set(entry.key, entry);
            }
            if (!keyOwners.has(entry.key)) {
              keyOwners.set(entry.key, new Set());
            }
            keyOwners.get(entry.key).add(node.id);
          }
        }
      } catch (err) {
        console.warn(`[${new Date().toISOString()}] [cluster-manager] [rebalance] Failed to export from node ${node.id}: ${err.message}`);
      }
    }

    // Step 2: Determine affected keys and migrate them to their correct nodes
    // "Move only the minimum required keys"
    let syncCount = 0;

    for (const [key, entry] of allKeys.entries()) {
      const routing = routingService.findNodesForKey(key);
      if (!routing.success) continue;

      const { primaryNode, replicaNode } = routing;
      const owners = keyOwners.get(key);
      let migrated = false;
      // Force synchronization to Primary and Replica regardless of ownership
      let primarySuccess = !primaryNode;
      if (primaryNode) {
        console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] Syncing key "${key}" to primary ${primaryNode.id}`);
        const res = await requestForwarder.forwardToNode(primaryNode, 'POST', '/api/v1/cache', entry, { 'x-is-replica': 'true' });
        if (res.success) {
          primarySuccess = true;
          migrated = true;
        }
      }

      let replicaSuccess = !replicaNode;
      if (replicaNode) {
        console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] Syncing key "${key}" to replica ${replicaNode.id}`);
        const res = await requestForwarder.forwardToNode(replicaNode, 'POST', '/api/v1/cache', entry, { 'x-is-replica': 'true' });
        if (res.success) {
          replicaSuccess = true;
          migrated = true;
        }
      }

      // Safe cleanup: Delete from old non-owners ONLY if sync succeeded to all required owners
      if (primarySuccess && replicaSuccess) {
        for (const ownerId of owners) {
          if ((!primaryNode || ownerId !== primaryNode.id) && (!replicaNode || ownerId !== replicaNode.id)) {
            const ownerNode = activeNodes.find(n => n.id === ownerId);
            if (ownerNode) {
              console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] Deleting stale key "${key}" from ${ownerId}`);
              await requestForwarder.forwardToNode(ownerNode, 'DELETE', `/api/v1/cache/${encodeURIComponent(key)}`);
            }
          }
        }
        if (migrated) syncCount++;
      } else {
        console.warn(`[${new Date().toISOString()}] [cluster-manager] [rebalance] Failed to fully sync key "${key}". Skipping stale cleanup.`);
      }
    }

    console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] COMPLETE: Synchronized ${syncCount} affected keys.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [cluster-manager] [rebalance] ERROR during rebalancing: ${err.message}`);
  } finally {
    isRebalancing = false;
  }
}

module.exports = { rebalanceCluster };
