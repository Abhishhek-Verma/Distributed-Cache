'use strict';

const axios = require('axios');
const config = require('../config');

// ─── Constants ────────────────────────────────────────────────────────────────

/** Timeout for all calls to the Cluster Manager (milliseconds). */
const CLIENT_TIMEOUT_MS = 8000;

// ─── HTTP Client ──────────────────────────────────────────────────────────────

/**
 * Create a pre-configured axios instance for Cluster Manager calls.
 * Base URL is loaded from CLUSTER_MANAGER_URL environment variable.
 * All responses (including 4xx from the cluster manager) are returned
 * as-is — validateStatus: () => true prevents axios from throwing.
 */
const clusterClient = axios.create({
  baseURL: config.clusterManagerUrl,
  timeout: CLIENT_TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json' },
  validateStatus: () => true,
});

// ─── Cache Operations ─────────────────────────────────────────────────────────

/**
 * Forward a cache SET request to the Cluster Manager.
 * @param {{ key: string, value: *, ttl?: number }} body
 * @returns {Promise<{ statusCode: number, data: Object }>}
 */
async function setCache(body) {
  const response = await clusterClient.post('/api/v1/cache', body);
  return { statusCode: response.status, data: response.data };
}

/**
 * Forward a cache GET request to the Cluster Manager.
 * @param {string} key
 * @returns {Promise<{ statusCode: number, data: Object }>}
 */
async function getCache(key) {
  const response = await clusterClient.get(`/api/v1/cache/${encodeURIComponent(key)}`);
  return { statusCode: response.status, data: response.data };
}

/**
 * Forward a cache DELETE request to the Cluster Manager.
 * @param {string} key
 * @returns {Promise<{ statusCode: number, data: Object }>}
 */
async function deleteCache(key) {
  const response = await clusterClient.delete(`/api/v1/cache/${encodeURIComponent(key)}`);
  return { statusCode: response.status, data: response.data };
}

// ─── Cluster Operations ───────────────────────────────────────────────────────

/**
 * Get cluster-level summary from the Cluster Manager.
 * @returns {Promise<{ statusCode: number, data: Object }>}
 */
async function getClusterInfo() {
  const response = await clusterClient.get('/api/v1/cluster');
  return { statusCode: response.status, data: response.data };
}

/**
 * Get all registered cache nodes from the Cluster Manager.
 * @returns {Promise<{ statusCode: number, data: Object }>}
 */
async function getClusterNodes() {
  const response = await clusterClient.get('/api/v1/cluster/nodes');
  return { statusCode: response.status, data: response.data };
}

/**
 * Register a new cache node with the Cluster Manager.
 * @param {{ id: string, host: string, port: number }} body
 * @returns {Promise<{ statusCode: number, data: Object }>}
 */
async function registerNode(body) {
  const response = await clusterClient.post('/api/v1/cluster/nodes', body);
  return { statusCode: response.status, data: response.data };
}

/**
 * Remove a cache node from the Cluster Manager.
 * @param {string} nodeId
 * @returns {Promise<{ statusCode: number, data: Object }>}
 */
async function removeNode(nodeId) {
  const response = await clusterClient.delete(`/api/v1/cluster/nodes/${nodeId}`);
  return { statusCode: response.status, data: response.data };
}

/**
 * Forward a cache export request to the Cluster Manager.
 * @returns {Promise<{ statusCode: number, data: Object }>}
 */
async function exportCache() {
  const response = await clusterClient.get('/api/v1/cache/_export');
  return { statusCode: response.status, data: response.data };
}

module.exports = {
  setCache,
  getCache,
  deleteCache,
  exportCache,
  getClusterInfo,
  getClusterNodes,
  registerNode,
  removeNode,
};
