'use strict';

const cacheStore = require('../storage/cacheStore');
const config = require('../config');

// ─── Constants ────────────────────────────────────────────────────────────────

/** Maximum allowed length for a cache key per API.md Section 9. */
const MAX_KEY_LENGTH = 255;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Build a CacheEntry object.
 * Follows Architecture.md — CacheEntry data model:
 *   { key, value, ttl, expiresAt, createdAt, updatedAt }
 *
 * @param {string} key
 * @param {*} value
 * @param {number} ttl - TTL in seconds (must be > 0)
 * @param {Date} [existingCreatedAt] - preserve createdAt when overwriting
 * @returns {Object} CacheEntry
 */
function buildCacheEntry(key, value, ttl, existingCreatedAt) {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttl * 1000);
  return {
    key,
    value,
    ttl,
    expiresAt,
    createdAt: existingCreatedAt || now,
    updatedAt: now,
  };
}

/**
 * Determine whether a stored CacheEntry has passed its expiry time.
 * @param {Object} entry - CacheEntry
 * @returns {boolean}
 */
function isExpired(entry) {
  if (!entry.expiresAt) return false;
  return Date.now() > entry.expiresAt.getTime();
}

/**
 * Validate a cache key.
 * Rules: required, string type, max 255 characters (API.md Section 9).
 * @param {*} key
 * @returns {string|null} error message or null if valid
 */
function validateKey(key) {
  if (key === undefined || key === null || key === '') {
    return 'Cache key is required';
  }
  if (typeof key !== 'string') {
    return 'Cache key must be a string';
  }
  if (key.length > MAX_KEY_LENGTH) {
    return `Cache key must not exceed ${MAX_KEY_LENGTH} characters`;
  }
  return null;
}

/**
 * Validate a TTL value.
 * Rules: optional, integer, greater than zero (API.md Section 9).
 * @param {*} ttl
 * @returns {string|null} error message or null if valid
 */
function validateTtl(ttl) {
  if (ttl === undefined || ttl === null) return null;
  if (!Number.isInteger(ttl) || ttl <= 0) {
    return 'TTL must be a positive integer';
  }
  return null;
}

/**
 * Validate a cache value.
 * Accepts: Object, Array, String, Number, Boolean (API.md Section 9).
 * @param {*} value
 * @returns {string|null} error message or null if valid
 */
function validateValue(value) {
  if (value === undefined || value === null) {
    return 'Cache value is required';
  }
  const allowedTypes = ['object', 'string', 'number', 'boolean'];
  if (!allowedTypes.includes(typeof value)) {
    return 'Cache value must be an object, array, string, number, or boolean';
  }
  return null;
}

// ─── Cache Operations ─────────────────────────────────────────────────────────

/**
 * SET — Store a cache entry on this node.
 *
 * - Validates key, value, and TTL.
 * - Enforces MAX_CACHE_SIZE (507 response when full, per Rules.md).
 * - Applies defaultTtl if no TTL provided.
 * - Preserves createdAt when overwriting an existing key.
 * - Logs every SET operation with timestamp and node ID.
 *
 * Follows: Phases.md Phase 2, API.md §5.1, Rules.md §8, Architecture.md CacheEntry model.
 *
 * @param {string} key
 * @param {*} value
 * @param {number|undefined} ttl - seconds (optional)
 * @returns {{ success: boolean, error?: string, statusCode?: number }}
 */
function setEntry(key, value, ttl) {
  const keyError = validateKey(key);
  if (keyError) return { success: false, error: keyError, statusCode: 400 };

  const valueError = validateValue(value);
  if (valueError) return { success: false, error: valueError, statusCode: 400 };

  const ttlError = validateTtl(ttl);
  if (ttlError) return { success: false, error: ttlError, statusCode: 400 };

  // Enforce max cache size — only when inserting a new key
  const isNew = !cacheStore.has(key);
  if (isNew && cacheStore.size() >= config.maxCacheSize) {
    console.warn(
      `[${new Date().toISOString()}] [${config.nodeId}] Cache full — rejected SET for key="${key}"`
    );
    return { success: false, error: 'Cache node is full', statusCode: 507 };
  }

  const resolvedTtl = (Number.isInteger(ttl) && ttl > 0) ? ttl : config.defaultTtl;

  // Preserve createdAt if overwriting an existing (non-expired) key
  const existingEntry = cacheStore.get(key);
  const existingCreatedAt =
    existingEntry && !isExpired(existingEntry) ? existingEntry.createdAt : undefined;

  const entry = buildCacheEntry(key, value, resolvedTtl, existingCreatedAt);
  cacheStore.set(key, entry);

  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] SET key="${key}" ttl=${resolvedTtl}s expiresAt=${entry.expiresAt.toISOString()}`
  );

  return { success: true };
}

/**
 * GET — Retrieve a cache entry from this node.
 *
 * - Returns 404 if the key does not exist.
 * - Performs lazy expiration: if the entry is found but expired,
 *   it is deleted immediately and a 404 is returned.
 * - Returns only key and value to the caller (internal timestamps are not exposed).
 *
 * Follows: Phases.md Phase 2, API.md §5.2, Rules.md §8.
 *
 * @param {string} key
 * @returns {{ success: boolean, data?: { key: string, value: * }, error?: string, statusCode?: number }}
 */
function getEntry(key) {
  const keyError = validateKey(key);
  if (keyError) return { success: false, error: keyError, statusCode: 400 };

  const entry = cacheStore.get(key);

  if (!entry) {
    return { success: false, error: 'Cache entry not found', statusCode: 404 };
  }

  // Lazy expiration — remove on read if expired
  if (isExpired(entry)) {
    cacheStore.delete(key);
    console.log(
      `[${new Date().toISOString()}] [${config.nodeId}] EXPIRED (lazy) key="${key}" — removed on GET`
    );
    return { success: false, error: 'Cache entry not found', statusCode: 404 };
  }

  return {
    success: true,
    data: {
      key: entry.key,
      value: entry.value,
    },
  };
}

/**
 * DELETE — Remove a cache entry from this node.
 *
 * - Returns 404 if the key does not exist or has expired.
 * - Logs every DELETE operation.
 *
 * Note: In Phase 6 (Replication), the Cluster Manager will call DELETE
 * on both the primary and replica nodes. This function handles only the
 * local delete on the current node.
 *
 * Follows: Phases.md Phase 2, API.md §5.3, Rules.md §8.
 *
 * @param {string} key
 * @returns {{ success: boolean, error?: string, statusCode?: number }}
 */
function deleteEntry(key) {
  const keyError = validateKey(key);
  if (keyError) return { success: false, error: keyError, statusCode: 400 };

  const entry = cacheStore.get(key);

  if (!entry || isExpired(entry)) {
    if (entry) cacheStore.delete(key); // Clean up expired entry
    return { success: false, error: 'Cache entry not found', statusCode: 404 };
  }

  cacheStore.delete(key);

  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] DELETE key="${key}"`
  );

  return { success: true };
}

/**
 * Return basic cache statistics.
 * Used by the health and monitoring endpoints in later phases.
 * @returns {{ size: number, maxSize: number, nodeId: string }}
 */
function getStats() {
  return {
    nodeId: config.nodeId,
    size: cacheStore.size(),
    maxSize: config.maxCacheSize,
  };
}

module.exports = {
  setEntry,
  getEntry,
  deleteEntry,
  getStats,
  isExpired,     // exported for use by ttlManager
};
