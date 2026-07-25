'use strict';

const axios = require('axios');
const config = require('../config');

let heartbeatTimer = null;
let sendingHeartbeat = false;

/**
 * Start sending periodic heartbeats to the Cluster Manager.
 *
 * Follows Phase 7 objectives:
 * - Implement heartbeat mechanism.
 * - Cache Nodes must periodically send heartbeats.
 */
async function startHeartbeat() {
  if (heartbeatTimer) return; // Already started

  const registerUrl = `${config.clusterManagerUrl}/api/v1/cluster/nodes`;
  const heartbeatUrl = registerUrl; // Use the exact same endpoint for heartbeats
  
  const nodeInfo = require('./nodeInfo').getNodeInfo();
  const payload = { 
    id: nodeInfo.id,
    host: nodeInfo.host,
    port: nodeInfo.port
  };

  try {
    await axios.post(registerUrl, {
      id: nodeInfo.id,
      host: nodeInfo.host,
      port: nodeInfo.port
    }, { timeout: 5000 });
    console.log(`[${new Date().toISOString()}] [${config.nodeId}] Successfully registered with Cluster Manager`);
  } catch (err) {
    console.warn(`[${new Date().toISOString()}] [${config.nodeId}] Failed to register with Cluster Manager: ${err.message}`);
  }

  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] [heartbeat] Starting heartbeat to ${heartbeatUrl} every ${config.heartbeatInterval}ms`
  );

  heartbeatTimer = setInterval(async () => {
    if (sendingHeartbeat) return;
    sendingHeartbeat = true;
    try {
      await axios.post(heartbeatUrl, payload, {
        timeout: 2000,
        headers: { 'Content-Type': 'application/json' },
      });
      // Silent on success to prevent log spam
    } catch (err) {
      console.warn(
        `[${new Date().toISOString()}] [${config.nodeId}] [heartbeat] Failed to send heartbeat: ${err.message}`
      );
    } finally {
      sendingHeartbeat = false;
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
