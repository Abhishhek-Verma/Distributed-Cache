'use strict';

const nodeRegistry = require('./nodeRegistry');
const hashRing = require('../routing/hashRing');
const config = require('../config');

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * CacheNode status values.
 * Follows Architecture.md — CacheNode model: status ONLINE / OFFLINE.
 */
const NODE_STATUS = Object.freeze({
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE',
});

/**
 * CacheNode role values.
 * Role is assigned by the Cluster Manager in Phase 6 (Replication).
 */
const NODE_ROLE = Object.freeze({
  PRIMARY: 'PRIMARY',
  REPLICA: 'REPLICA',
  UNKNOWN: 'UNKNOWN',
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Validate a node registration payload.
 * Required fields per API.md §6.3: id, host, port.
 * @param {Object} payload
 * @returns {string|null} error message or null if valid
 */
function validateNodePayload(payload) {
  const { id, host, port } = payload;

  if (!id || typeof id !== 'string' || id.trim() === '') {
    return 'Node ID is required and must be a non-empty string';
  }
  if (!host || typeof host !== 'string' || host.trim() === '') {
    return 'Node host is required and must be a non-empty string';
  }

  // SSRF Hardening: Prevent internal routing loops and unallowed schemes
  const lowerHost = host.toLowerCase();
  if (lowerHost === 'localhost' || lowerHost === '0.0.0.0' || /^127\./.test(lowerHost)) {
    return 'Host cannot be a loopback or wildcard address';
  }
  if (host.includes('://') || host.includes('/')) {
    return 'Host cannot contain URL schemes or paths';
  }

  if (port === undefined || port === null) {
    return 'Node port is required';
  }
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    return 'Node port must be an integer between 1024 and 65535';
  }
  return null;
}

// ─── Operations ───────────────────────────────────────────────────────────────

/**
 * Register a new cache node with the cluster.
 *
 * If the node ID already exists (re-registration after node rejoin),
 * the existing record is updated with the new host/port and status
 * is reset to ONLINE. This satisfies the Phase 8 rejoin behaviour
 * defined in Phases.md Phase 8 — Node Rejoin Behavior.
 *
 * Follows: API.md §6.3, Architecture.md Cluster Manager responsibilities.
 *
 * @param {{ id: string, host: string, port: number }} payload
 * @returns {{ success: boolean, message?: string, error?: string, statusCode?: number }}
 */
function registerNode(payload) {
  const error = validateNodePayload(payload);
  if (error) return { success: false, error, statusCode: 400 };

  const { id, host, port } = payload;
  const now = new Date().toISOString();

  if (nodeRegistry.has(id)) {
    // Re-registration or Heartbeat
    const existing = nodeRegistry.get(id);
    const wasOffline = existing.status === NODE_STATUS.OFFLINE;

    existing.host = host;
    existing.port = port;
    existing.status = NODE_STATUS.ONLINE;
    existing.updatedAt = now;
    existing.lastHeartbeat = now;
    nodeRegistry.set(id, existing);

    if (wasOffline) {
      // Ensure node is in the hash ring ONLY if it was offline
      hashRing.addNode(id);
      
      console.log(
        `[${now}] [cluster-manager] [node-registry] Node RE-JOINED: id=${id} host=${host} port=${port}`
      );
    }
    return { success: true, message: 'Node heartbeat successful', topologyChanged: wasOffline };
  }

  const node = {
    id,
    host,
    port,
    status: NODE_STATUS.ONLINE,
    role: NODE_ROLE.UNKNOWN,     // assigned in Phase 6 (Replication)
    lastHeartbeat: now,          // initialized immediately
    registeredAt: now,
    updatedAt: now,
  };

  nodeRegistry.set(id, node);
  
  // Phase 5: Add new node to the hash ring
  hashRing.addNode(id);

  console.log(
    `[${now}] [cluster-manager] [node-registry] Node REGISTERED: id=${id} host=${host} port=${port}`
  );
  return { success: true, message: 'Node registered successfully', topologyChanged: true };
}

/**
 * Remove a cache node from the cluster registry.
 *
 * Follows: API.md §6.4, Architecture.md — Handle node removal.
 *
 * @param {string} nodeId
 * @returns {{ success: boolean, message?: string, error?: string, statusCode?: number }}
 */
function removeNode(nodeId) {
  if (!nodeId || typeof nodeId !== 'string') {
    return { success: false, error: 'Node ID is required', statusCode: 400 };
  }
  if (!nodeRegistry.has(nodeId)) {
    return { success: false, error: 'Node not found', statusCode: 404 };
  }

  nodeRegistry.delete(nodeId);
  
  // Phase 5: Remove node from the hash ring
  hashRing.removeNode(nodeId);

  console.log(
    `[${new Date().toISOString()}] [cluster-manager] [node-registry] Node REMOVED: id=${nodeId}`
  );
  return { success: true, message: 'Node removed successfully' };
}

/**
 * Retrieve a single node record by ID.
 * @param {string} nodeId
 * @returns {{ success: boolean, data?: Object, error?: string, statusCode?: number }}
 */
function getNode(nodeId) {
  const node = nodeRegistry.get(nodeId);
  if (!node) {
    return { success: false, error: 'Node not found', statusCode: 404 };
  }
  return { success: true, data: { ...node } };
}

/**
 * Return all registered CacheNode records.
 * @returns {Object[]}
 */
function getAllNodes() {
  return nodeRegistry.values().map(n => ({ ...n }));
}

/**
 * Return only ONLINE CacheNode records.
 * Used by routingService to select a target node.
 * @returns {Object[]}
 */
function getActiveNodes() {
  return getAllNodes().filter(n => n.status === NODE_STATUS.ONLINE);
}

/**
 * Build a cluster-level summary.
 * Follows: API.md §6.1 — Get Cluster Information response shape.
 * @returns {{ totalNodes: number, healthyNodes: number, failedNodes: number, replicationFactor: number }}
 */
function getClusterInfo() {
  const all = getAllNodes();
  const healthyCount = all.filter(n => n.status === NODE_STATUS.ONLINE).length;
  return {
    totalNodes: all.length,
    healthyNodes: healthyCount,
    failedNodes: all.length - healthyCount,
    replicationFactor: config.replicationFactor,
  };
}

/**
 * Update a node's status (ONLINE / OFFLINE).
 * Called by Phase 7 HeartbeatService when a node stops responding.
 * @param {string} nodeId
 * @param {string} status - NODE_STATUS value
 * @returns {{ success: boolean, error?: string, statusCode?: number }}
 */
function setNodeStatus(nodeId, status) {
  if (!Object.values(NODE_STATUS).includes(status)) {
    return { success: false, error: `Invalid status: ${status}`, statusCode: 400 };
  }
  const node = nodeRegistry.get(nodeId);
  if (!node) {
    return { success: false, error: 'Node not found', statusCode: 404 };
  }
  node.status = status;
  node.updatedAt = new Date().toISOString();
  nodeRegistry.set(nodeId, node);
  
  // Keep hash ring in sync with node status
  if (status === NODE_STATUS.OFFLINE) {
    hashRing.removeNode(nodeId);
  } else if (status === NODE_STATUS.ONLINE) {
    hashRing.addNode(nodeId);
  }
  
  return { success: true };
}

/**
 * Record a heartbeat for a node.
 * Follows Phase 7 objectives to maintain node status.
 * @param {string} nodeId
 * @returns {{ success: boolean, error?: string, statusCode?: number }}
 */
function recordHeartbeat(nodeId) {
  const node = nodeRegistry.get(nodeId);
  if (!node) {
    return { success: false, error: 'Node not found', statusCode: 404 };
  }
  
  const now = new Date().toISOString();
  node.lastHeartbeat = now;
  node.updatedAt = now;
  
  // If the node was offline, a heartbeat recovers it
  if (node.status === NODE_STATUS.OFFLINE) {
    console.log(`[${now}] [cluster-manager] [heartbeat] Node ${nodeId} RECOVERED via heartbeat`);
    setNodeStatus(nodeId, NODE_STATUS.ONLINE);
  }
  
  nodeRegistry.set(nodeId, node);
  return { success: true };
}

module.exports = {
  registerNode,
  removeNode,
  getNode,
  getAllNodes,
  getActiveNodes,
  getClusterInfo,
  setNodeStatus,
  recordHeartbeat,
  NODE_STATUS,
  NODE_ROLE,
};
