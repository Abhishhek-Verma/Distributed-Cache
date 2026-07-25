'use strict';

/**
 * NodeRegistry
 *
 * Responsibility: Raw in-memory storage for CacheNode records.
 * Uses a JavaScript Map keyed by node ID.
 *
 * This is the single source of truth for all registered cache nodes.
 * No business logic lives here — only Map operations.
 *
 * Exported as a singleton so all modules in this process share
 * exactly one node registry. Node.js is single-threaded, so there
 * is no concurrent modification risk.
 *
 * Follows Rules.md Rule 1 — Single Responsibility.
 * Follows Architecture.md — Cluster Manager responsibilities.
 */
class NodeRegistry {
  constructor() {
    /** @type {Map<string, Object>} key = nodeId, value = CacheNode */
    this._registry = new Map();
  }

  /**
   * Store or overwrite a CacheNode record.
   * @param {string} nodeId
   * @param {Object} node - CacheNode object
   */
  set(nodeId, node) {
    this._registry.set(nodeId, node);
  }

  /**
   * Retrieve a CacheNode record by ID.
   * @param {string} nodeId
   * @returns {Object|undefined}
   */
  get(nodeId) {
    return this._registry.get(nodeId);
  }

  /**
   * Delete a CacheNode record.
   * @param {string} nodeId
   * @returns {boolean}
   */
  delete(nodeId) {
    return this._registry.delete(nodeId);
  }

  /**
   * Check if a node ID is registered.
   * @param {string} nodeId
   * @returns {boolean}
   */
  has(nodeId) {
    return this._registry.has(nodeId);
  }

  /**
   * Return the total number of registered nodes.
   * @returns {number}
   */
  size() {
    return this._registry.size;
  }

  /**
   * Return all registered CacheNode records as an array.
   * @returns {Object[]}
   */
  values() {
    return Array.from(this._registry.values());
  }
}

// Singleton — one registry per cluster-manager process
module.exports = new NodeRegistry();
