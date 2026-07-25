'use strict';

const crypto = require('crypto');
const config = require('../config');

/**
 * Consistent Hash Ring
 *
 * Distributes cache keys across physical cache nodes using a consistent hashing algorithm.
 * Uses SHA-256 as the underlying hash function.
 * Assigns virtual nodes to each physical node to ensure balanced key distribution.
 *
 * Follows Phases.md Phase 5 objectives and Rules.md Section 9 rules.
 */
class HashRing {
  constructor() {
    /** 
     * The sorted ring of virtual nodes.
     * Array of { hash: number, nodeId: string }
     * Kept sorted by hash value ascending for efficient binary search.
     */
    this._ring = [];
    
    /** Number of virtual nodes per physical node */
    this._vNodes = config.virtualNodesPerPhysical || 150;
  }

  /**
   * Compute the hash for a given string key.
   * Defined in Rules.md Section 9:
   * parseInt(crypto.createHash('sha256').update(key).digest('hex').slice(0, 8), 16)
   * 
   * @param {string} key 
   * @returns {number}
   */
  _computeHash(key) {
    return parseInt(crypto.createHash('sha256').update(key).digest('hex').slice(0, 8), 16);
  }

  /**
   * Add a physical node to the hash ring.
   * Generates _vNodes virtual nodes and inserts them into the ring in sorted order.
   * 
   * @param {string} nodeId 
   */
  addNode(nodeId) {
    // Prevent duplicate virtual nodes if physical node is already added
    if (this._ring.some(v => v.nodeId === nodeId)) {
      return;
    }

    for (let i = 0; i < this._vNodes; i++) {
      const vNodeKey = `${nodeId}#${i}`;
      const hash = this._computeHash(vNodeKey);
      
      this._ring.push({ hash, nodeId });
    }

    // Keep the ring sorted for binary search
    this._ring.sort((a, b) => a.hash - b.hash);

    console.log(
      `[${new Date().toISOString()}] [cluster-manager] [hash-ring] Added node=${nodeId} with ${this._vNodes} virtual nodes`
    );
  }

  /**
   * Remove a physical node from the hash ring.
   * Removes all associated virtual nodes.
   * 
   * @param {string} nodeId 
   */
  removeNode(nodeId) {
    const initialSize = this._ring.length;
    this._ring = this._ring.filter(v => v.nodeId !== nodeId);
    
    if (this._ring.length < initialSize) {
      console.log(
        `[${new Date().toISOString()}] [cluster-manager] [hash-ring] Removed node=${nodeId} (removed ${initialSize - this._ring.length} virtual nodes)`
      );
    }
  }

  /**
   * Find the primary and replica nodes for a given cache key.
   * Primary is the first virtual node clockwise on the ring.
   * Replica is the next DISTINCT physical node clockwise from the primary.
   * 
   * @param {string} key
   * @returns {{ primary: string|null, replica: string|null }}
   */
  getNodesForKey(key) {
    if (this._ring.length === 0) {
      return { primary: null, replica: null };
    }

    const hash = this._computeHash(key);
    
    // Binary search for the first virtual node with hash >= key hash
    let left = 0;
    let right = this._ring.length - 1;
    let index = -1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this._ring[mid].hash >= hash) {
        index = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }

    // If no virtual node is found with hash >= key hash, wrap around to the first node
    if (index === -1) {
      index = 0;
    }

    const primaryNodeId = this._ring[index].nodeId;
    let replicaNodeId = null;

    // Scan clockwise to find the first virtual node belonging to a different physical node
    for (let i = 1; i < this._ring.length; i++) {
      const nextIndex = (index + i) % this._ring.length;
      if (this._ring[nextIndex].nodeId !== primaryNodeId) {
        replicaNodeId = this._ring[nextIndex].nodeId;
        break;
      }
    }

    return { primary: primaryNodeId, replica: replicaNodeId };
  }
}

// Export as singleton to be shared
module.exports = new HashRing();
