'use strict';

let cacheHits = 0;
let cacheMisses = 0;
let requestsTotal = 0;

function incrementHits() {
  cacheHits++;
}

function incrementMisses() {
  cacheMisses++;
}

function incrementRequests() {
  requestsTotal++;
}

/**
 * Generate Prometheus-compatible text metrics.
 * Follows Phase 10 Requirements:
 * - Expose metrics endpoints for Prometheus scraping.
 * - Cache Hits, Cache Misses, Requests, Memory.
 * 
 * @param {number} cacheSize 
 * @returns {string} Prometheus metrics payload
 */
function getPrometheusMetrics(cacheSize) {
  const mem = process.memoryUsage();
  const hitRatio = requestsTotal === 0 ? 0 : (cacheHits / requestsTotal) * 100;
  
  return `
# HELP cache_hits_total Total cache hits
# TYPE cache_hits_total counter
cache_hits_total ${cacheHits}

# HELP cache_misses_total Total cache misses
# TYPE cache_misses_total counter
cache_misses_total ${cacheMisses}

# HELP cache_requests_total Total cache HTTP requests
# TYPE cache_requests_total counter
cache_requests_total ${requestsTotal}

# HELP cache_memory_usage_bytes Node memory usage in bytes
# TYPE cache_memory_usage_bytes gauge
cache_memory_usage_bytes ${mem.heapUsed}

# HELP cache_size_total Current number of entries in cache
# TYPE cache_size_total gauge
cache_size_total ${cacheSize}

# HELP cache_hit_ratio Cache hit ratio percentage
# TYPE cache_hit_ratio gauge
cache_hit_ratio ${hitRatio}
`.trim();
}

module.exports = {
  incrementHits,
  incrementMisses,
  incrementRequests,
  getPrometheusMetrics
};
