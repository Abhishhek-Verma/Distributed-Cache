'use strict';

const axios = require('axios');

// ─── Constants ────────────────────────────────────────────────────────────────

/** Timeout for requests forwarded to cache nodes (milliseconds). */
const FORWARD_TIMEOUT_MS = 5000;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Forward an HTTP request from the Cluster Manager to a target cache node.
 *
 * Handles three outcomes:
 *   1. Cache node returns a valid response  → forwards status + body
 *   2. Cache node returns an error response → forwards that error status + body
 *   3. Network failure (ECONNREFUSED etc.) → returns 503 Service Unavailable
 *
 * Follows: Rules.md §6 — Error Handling Rules.
 * Follows: Architecture.md — Cluster Manager routes requests to Cache Nodes.
 *
 * @param {Object} node - CacheNode record { id, host, port }
 * @param {string} method - HTTP method (GET, POST, DELETE)
 * @param {string} path - Path on the cache node (e.g., '/api/v1/cache/myKey')
 * @param {Object|undefined} body - Request body for POST requests
 * @param {Object|undefined} customHeaders - Optional additional headers
 * @returns {Promise<{ success: boolean, statusCode: number, data: Object }>}
 */
async function forwardToNode(node, method, path, body, customHeaders = {}) {
  const url = `http://${node.host}:${node.port}${path}`;

  console.log(
    `[${new Date().toISOString()}] [cluster-manager] [forwarder] → ${method} ${url}`
  );

  try {
    const response = await axios({
      method,
      url,
      data: body,
      timeout: FORWARD_TIMEOUT_MS,
      headers: { 
        'Content-Type': 'application/json',
        ...customHeaders 
      },
      // Don't let axios throw on 4xx responses — handle them ourselves
      validateStatus: () => true,
    });

    console.log(
      `[${new Date().toISOString()}] [cluster-manager] [forwarder] ← ${response.status} from ${node.id}`
    );

    return {
      success: response.status >= 200 && response.status < 300,
      statusCode: response.status,
      data: response.data,
    };
  } catch (err) {
    // Network-level failure (connection refused, DNS error, timeout)
    console.error(
      `[${new Date().toISOString()}] [cluster-manager] [forwarder] Network error reaching node ${node.id}: ${err.message}`
    );
    return {
      success: false,
      statusCode: 503,
      data: {
        success: false,
        message: `Cache node ${node.id} is unreachable: ${err.message}`,
      },
    };
  }
}

module.exports = { forwardToNode };
