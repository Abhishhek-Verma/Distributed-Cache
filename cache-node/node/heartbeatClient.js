'use strict';

const axios = require('axios');
const config = require('../config');

let heartbeatTimer = null;

/**
 * Start sending periodic heartbeats to the Cluster Manager.
 *
 * Follows Phase 7 objectives:
 * - Implement heartbeat mechanism.
 * - Cache Nodes must periodically send heartbeats.
 */
function startHeartbeat() {
  if (heartbeatTimer) return; // Already started

  const url = `${config.clusterManagerUrl}/api/v1/cluster/heartbeat`;
  const payload = { id: config.nodeId };

  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] [heartbeat] Starting heartbeat to ${url} every ${config.heartbeatInterval}ms`
  );

  heartbeatTimer = setInterval(async () => {
    try {
      await axios.post(url, payload, {
        timeout: 2000,
        headers: { 'Content-Type': 'application/json' },
      });
      // Silent on success to prevent log spam
    } catch (err) {
      console.warn(
        `[${new Date().toISOString()}] [${config.nodeId}] [heartbeat] Failed to send heartbeat: ${err.message}`
      );
    }
  }, config.heartbeatInterval);
}

/**
 * Stop sending heartbeats (used during graceful shutdown).
 */
function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
    console.log(
      `[${new Date().toISOString()}] [${config.nodeId}] [heartbeat] Heartbeat stopped.`
    );
  }
}

module.exports = { startHeartbeat, stopHeartbeat };
