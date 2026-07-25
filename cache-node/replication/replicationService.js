'use strict';

const axios = require('axios');
const config = require('../config');

// ─── Constants ────────────────────────────────────────────────────────────────

/** Timeout for replication requests to the replica node (milliseconds). */
const REPLICATION_TIMEOUT_MS = 5000;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a synchronous replication request to the assigned replica node.
 *
 * Handles HTTP requests (POST for SET, DELETE for DELETE) to the replica.
 * Uses `x-is-replica: true` header to prevent infinite replication loops.
 *
 * Follows Phase 6 replication rules from Rules.md:
 * - Synchronous replication.
 * - Entire write operation fails if replica is unreachable.
 *
 * @param {string} replicaUrl - Full URL to the replica node's endpoint.
 * @param {string} method - HTTP method (POST or DELETE).
 * @param {Object} [body] - Request body (required for POST).
 * @returns {Promise<{ success: boolean, statusCode: number, error?: string }>}
 */
async function replicate(replicaUrl, method, body = undefined) {
  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] [replication] → ${method} ${replicaUrl}`
  );

  try {
    const response = await axios({
      method,
      url: replicaUrl,
      data: body,
      timeout: REPLICATION_TIMEOUT_MS,
      headers: {
        'Content-Type': 'application/json',
        'x-is-replica': 'true', // Prevent infinite replication loops
      },
      // Don't let axios throw on 4xx/5xx responses
      validateStatus: () => true,
    });

    console.log(
      `[${new Date().toISOString()}] [${config.nodeId}] [replication] ← ${response.status} from replica`
    );

    if (response.status >= 200 && response.status < 300) {
      return { success: true, statusCode: response.status };
    } else {
      return {
        success: false,
        statusCode: response.status,
        error: response.data?.message || `Replica returned status ${response.status}`,
      };
    }
  } catch (err) {
    // Network-level failure (connection refused, timeout)
    console.error(
      `[${new Date().toISOString()}] [${config.nodeId}] [replication] Network error reaching replica: ${err.message}`
    );
    return {
      success: false,
      statusCode: 503,
      error: 'replica node unreachable',
    };
  }
}

module.exports = { replicate };
