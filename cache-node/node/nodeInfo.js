'use strict';

const os = require('os');
const config = require('../config');

// ─── Status Constants ─────────────────────────────────────────────────────────

/**
 * Possible values for CacheNode.status.
 * Follows Architecture.md — CacheNode model.
 */
const NODE_STATUS = Object.freeze({
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
});

// ─── Role Constants ───────────────────────────────────────────────────────────

/**
 * Possible values for CacheNode.role.
 * Role is assigned by the Cluster Manager in Phase 6 (Replication).
 * Defaults to UNKNOWN until then.
 * Follows Architecture.md — CacheNode model.
 */
const NODE_ROLE = Object.freeze({
  PRIMARY: 'PRIMARY',
  REPLICA: 'REPLICA',
  UNKNOWN: 'UNKNOWN',
});

// ─── Node State ───────────────────────────────────────────────────────────────

/**
 * Internal mutable state for this node's CacheNode record.
 * Follows Architecture.md — CacheNode data model:
 *   { id, host, port, status, lastHeartbeat, role }
 *
 * Note: 'host' uses the OS hostname (resolves to the Docker container
 * hostname in production, which matches the service name in docker-compose).
 */
const _state = {
  id: config.nodeId,
  host: os.hostname(),
  port: config.port,
  status: NODE_STATUS.ONLINE,
  role: NODE_ROLE.UNKNOWN,       // set by Cluster Manager in Phase 6
  lastHeartbeat: null,           // updated by HeartbeatService in Phase 7
  startedAt: new Date().toISOString(),
};

// ─── Public Accessors ─────────────────────────────────────────────────────────

/**
 * Return a snapshot of the current node's CacheNode record.
 * Returns a shallow copy so callers cannot mutate internal state.
 * @returns {Object} CacheNode
 */
function getNodeInfo() {
  return { ..._state };
}

/**
 * Update the node's operational status.
 * @param {string} status - One of NODE_STATUS values
 */
function setStatus(status) {
  if (!Object.values(NODE_STATUS).includes(status)) {
    throw new Error(`Invalid node status: ${status}`);
  }
  _state.status = status;
}

/**
 * Update the node's replication role.
 * Called by the Replication service in Phase 6.
 * @param {string} role - One of NODE_ROLE values
 */
function setRole(role) {
  if (!Object.values(NODE_ROLE).includes(role)) {
    throw new Error(`Invalid node role: ${role}`);
  }
  _state.role = role;
}

/**
 * Update the lastHeartbeat timestamp to now.
 * Called by the HeartbeatService in Phase 7.
 */
function updateLastHeartbeat() {
  _state.lastHeartbeat = new Date().toISOString();
}

module.exports = {
  getNodeInfo,
  setStatus,
  setRole,
  updateLastHeartbeat,
  NODE_STATUS,
  NODE_ROLE,
};
