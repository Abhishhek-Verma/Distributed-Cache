'use strict';

const nodeRegistryService = require('./nodeRegistryService');
const config = require('../config');
const recoveryService = require('./recoveryService');

let monitorTimer = null;

/**
 * Start the heartbeat monitor to detect failed nodes.
 *
 * Sweeps the node registry periodically (every heartbeatInterval).
 * If a node hasn't sent a heartbeat within heartbeatTimeout,
 * it is marked as OFFLINE.
 *
 * Follows Phase 7 objectives:
 * - Configure heartbeat interval and timeout.
 * - Detect failed nodes only after timeout expires.
 * - Prevent false positives (timeout > interval).
 * - Update node status consistently.
 */
function startMonitor() {
  if (monitorTimer) return;

  const interval = config.heartbeatInterval;
  const timeout = config.heartbeatTimeout;

  console.log(
    `[${new Date().toISOString()}] [cluster-manager] [heartbeat] Monitor started (interval=${interval}ms, timeout=${timeout}ms)`
  );

  monitorTimer = setInterval(() => {
    const nodes = nodeRegistryService.getAllNodes();
    const now = Date.now();

    nodes.forEach(node => {
      // Only check nodes that are currently ONLINE
      if (node.status === nodeRegistryService.NODE_STATUS.ONLINE) {
        // If node has never sent a heartbeat, use its registeredAt time
        const lastSeenStr = node.lastHeartbeat || node.registeredAt;
        const lastSeen = new Date(lastSeenStr).getTime();
        
        if (now - lastSeen > timeout) {
          console.warn(
            `[${new Date().toISOString()}] [cluster-manager] [heartbeat] Node ${node.id} missed heartbeat timeout (${now - lastSeen}ms). Marking OFFLINE.`
          );
          nodeRegistryService.setNodeStatus(node.id, nodeRegistryService.NODE_STATUS.OFFLINE);
          
          // Phase 8: Trigger Automatic Recovery / Self-Healing
          recoveryService.recoverNode(node.id);
        }
      }
    });
  }, interval); // Run check every interval
}

/**
 * Stop the heartbeat monitor cleanly.
 */
function stopMonitor() {
  if (monitorTimer) {
    clearInterval(monitorTimer);
    monitorTimer = null;
    console.log(`[${new Date().toISOString()}] [cluster-manager] [heartbeat] Monitor stopped.`);
  }
}

module.exports = { startMonitor, stopMonitor };
