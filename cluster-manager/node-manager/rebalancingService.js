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
            allKeys.set(entry.key, entry);
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

      // Check if primary needs this key
      if (primaryNode && !owners.has(primaryNode.id)) {
        console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] Migrating key "${key}" to new primary ${primaryNode.id}`);
        await requestForwarder.forwardToNode(primaryNode, 'POST', '/api/v1/cache', entry, { 'x-is-replica': 'true' });
        migrated = true;
      }

      // Check if replica needs this key
      if (replicaNode && !owners.has(replicaNode.id)) {
        console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] Migrating key "${key}" to new replica ${replicaNode.id}`);
        await requestForwarder.forwardToNode(replicaNode, 'POST', '/api/v1/cache', entry, { 'x-is-replica': 'true' });
        migrated = true;
      }

      if (migrated) syncCount++;
    }

    console.log(`[${new Date().toISOString()}] [cluster-manager] [rebalance] COMPLETE: Synchronized ${syncCount} affected keys.`);
  } catch (err) {
    console.error(`[${new Date().toISOString()}] [cluster-manager] [rebalance] ERROR during rebalancing: ${err.message}`);
  } finally {
    isRebalancing = false;
  }
}

module.exports = { rebalanceCluster };
