'use strict';

const cacheStore = require('../storage/cacheStore');
const config = require('../config');

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * How often the background cleanup job runs (milliseconds).
 * Fixed at 10 seconds — aggressive enough to keep memory clean
 * without adding measurable overhead to the event loop.
 * This complements lazy expiration in cacheEngine.getEntry().
 */
const TTL_CLEANUP_INTERVAL_MS = 10000;

// ─── State ────────────────────────────────────────────────────────────────────

/** @type {NodeJS.Timeout|null} */
let cleanupTimer = null;

// ─── Core Logic ───────────────────────────────────────────────────────────────

/**
 * Scan the entire store and remove every entry whose expiresAt
 * timestamp has passed.
 *
 * This is an eager (background) expiration pass.
 * A second, lazy expiration pass happens inside cacheEngine.getEntry()
 * so expired entries are never returned even between cleanup cycles.
 *
 * Node.js is single-threaded — iterating the Map here is safe because
 * no other code runs concurrently within a single event-loop tick.
 * Deleting from a Map while iterating over it via entries() is safe
 * in V8: entries already yielded are unaffected; not-yet-yielded
 * deleted entries are simply skipped.
 */
function removeExpiredEntries() {
  const now = Date.now();
  let removedCount = 0;

  for (const [key, entry] of cacheStore.entries()) {
    if (entry.expiresAt && now > entry.expiresAt.getTime()) {
      cacheStore.delete(key);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    console.log(
      `[${new Date().toISOString()}] [${config.nodeId}] [ttl-manager] Cleaned ${removedCount} expired entr${removedCount === 1 ? 'y' : 'ies'}`
    );
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Start the background TTL expiration timer.
 *
 * Safe to call multiple times — a second call while the timer is
 * already running is a no-op.
 *
 * Follows: Phases.md Phase 2 — "Expired key cleanup".
 */
function start() {
  if (cleanupTimer !== null) return;

  cleanupTimer = setInterval(removeExpiredEntries, TTL_CLEANUP_INTERVAL_MS);

  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] [ttl-manager] Started — cleanup every ${TTL_CLEANUP_INTERVAL_MS / 1000}s`
  );
}

/**
 * Stop the background TTL expiration timer.
 *
 * Called during graceful shutdown to prevent the timer from holding
 * the Node.js event loop open after the server closes.
 */
function stop() {
  if (cleanupTimer === null) return;

  clearInterval(cleanupTimer);
  cleanupTimer = null;

  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] [ttl-manager] Stopped`
  );
}

module.exports = { start, stop };
