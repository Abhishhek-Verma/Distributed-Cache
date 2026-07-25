'use strict';

const nodeRegistryService = require('./nodeRegistryService');
const config = require('../config');
const recoveryService = require('./recoveryService');

let monitorTimer = null;
let checking = false; // Added to prevent overlapping sweeps

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

  monitorTimer = setInterval(async () => {
    // If a previous sweep is still running, immediately return
    if (checking === true) {
      return;
    }

    // Set checking = true before beginning the heartbeat scan
    checking = true;

    try {
      const nodes = nodeRegistryService.getAllNodes();
      const now = Date.now();

      for (const node of nodes) {
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
            await recoveryService.recoverNode(node.id);
          }
        }
      }
    } finally {
      // Always reset checking = false, even if an exception occurs
      checking = false;
    }
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
