'use strict';

/**
 * CacheStore
 *
 * Responsibility: Raw in-memory storage using a JavaScript Map.
 * This module performs only direct Map operations — no TTL logic,
 * no validation, no business rules. It is the single source of truth
 * for all cached data on this node.
 *
 * Design: Exported as a singleton so all modules on this node
 * share one Map. Node.js is single-threaded (event-loop based),
 * so concurrent Map modification is not possible within one process.
 *
 * Follows Architecture.md — CacheEntry model:
 *   { key, value, ttl, expiresAt, createdAt, updatedAt }
 *
 * Follows Rules.md Rule 1 — Single responsibility.
 */

class CacheStore {
  constructor() {
    /** @type {Map<string, Object>} */
    this._store = new Map();
  }

  /**
   * Store a CacheEntry under the given key.
   * @param {string} key
   * @param {Object} entry - Full CacheEntry object
   */
  set(key, entry) {
    this._store.set(key, entry);
  }

  /**
   * Retrieve a CacheEntry by key.
   * @param {string} key
   * @returns {Object|undefined}
   */
  get(key) {
    return this._store.get(key);
  }

  /**
   * Delete a CacheEntry by key.
   * @param {string} key
   * @returns {boolean} true if an entry was deleted, false if key was not found
   */
  delete(key) {
    return this._store.delete(key);
  }

  /**
   * Check whether a key exists in the store.
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this._store.has(key);
  }

  /**
   * Return the number of entries currently held in the store.
   * @returns {number}
   */
  size() {
    return this._store.size;
  }

  /**
   * Return an iterator over all [key, entry] pairs.
   * Used by ttlManager to scan for expired entries.
   * @returns {IterableIterator<[string, Object]>}
   */
  entries() {
    return this._store.entries();
  }

  /**
   * Remove all entries from the store.
   * Used during testing and graceful shutdown.
   */
  clear() {
    this._store.clear();
  }
}

// Singleton — one store per cache-node process
module.exports = new CacheStore();
