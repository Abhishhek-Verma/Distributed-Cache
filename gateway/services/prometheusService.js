'use strict';

const http = require('http');

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://prometheus:9090';

/**
 * Perform an HTTP GET request to Prometheus
 * @param {string} endpoint - e.g. '/api/v1/query?query=...'
 * @returns {Promise<Object>}
 */
function fetchPrometheus(endpoint) {
  return new Promise((resolve, reject) => {
    const url = `${PROMETHEUS_URL}${endpoint}`;
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            return reject(new Error(`Prometheus HTTP ${res.statusCode}`));
          }
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Execute a PromQL instant vector query
 * @param {string} query
 * @returns {Promise<number>}
 */
async function queryInstant(query) {
  const res = await fetchPrometheus(`/api/v1/query?query=${encodeURIComponent(query)}`);
  if (res.status === 'success' && res.data?.result?.length > 0) {
    const val = parseFloat(res.data.result[0].value[1]);
    return isNaN(val) ? 0 : val;
  }
  return 0;
}

/**
 * Execute a PromQL range query
 * @param {string} query
 * @param {number} durationMinutes - default 15
 * @param {string} step - default '30s'
 * @returns {Promise<Array<{timestamp: string, time: string, value: number}>>}
 */
async function queryRange(query, durationMinutes = 15, step = '30s') {
  const now = Math.floor(Date.now() / 1000);
  const start = now - (durationMinutes * 60);
  const res = await fetchPrometheus(`/api/v1/query_range?query=${encodeURIComponent(query)}&start=${start}&end=${now}&step=${step}`);
  if (res.status === 'success' && res.data?.result?.length > 0) {
    const values = res.data.result[0].values;
    return values.map(([ts, val]) => {
      const date = new Date(ts * 1000);
      return {
        timestamp: date.toISOString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        value: parseFloat(val) || 0
      };
    });
  }
  return [];
}

/**
 * Get aggregated overview metrics
 */
async function getOverview() {
  const [
    hits,
    misses,
    hitRatio,
    cacheRequests,
    gatewayRequests,
    clusterRequests,
    activeNodes,
    failedNodes,
    memoryBytes,
    totalKeys,
    gatewayStatus,
    clusterStatus
  ] = await Promise.all([
    queryInstant('sum(cache_hits_total)'),
    queryInstant('sum(cache_misses_total)'),
    queryInstant('avg(cache_hit_ratio)'),
    queryInstant('sum(cache_requests_total)'),
    queryInstant('sum(gateway_requests_total)'),
    queryInstant('sum(cluster_requests_total)'),
    queryInstant('cluster_active_nodes'),
    queryInstant('cluster_failed_nodes'),
    queryInstant('sum(cache_memory_usage_bytes)'),
    queryInstant('sum(cache_size_total)'),
    queryInstant('gateway_status'),
    queryInstant('cluster_status')
  ]);

  const totalRequests = cacheRequests || (hits + misses) || gatewayRequests;
  const calculatedHitRatio = totalRequests > 0 ? (hits / totalRequests) * 100 : (hitRatio ? hitRatio * 100 : 0);

  return {
    hits: Math.round(hits),
    misses: Math.round(misses),
    hitRatio: parseFloat(calculatedHitRatio.toFixed(1)),
    cacheRequests: Math.round(cacheRequests),
    gatewayRequests: Math.round(gatewayRequests),
    clusterRequests: Math.round(clusterRequests),
    activeNodes: Math.round(activeNodes),
    failedNodes: Math.round(failedNodes),
    memoryBytes: Math.round(memoryBytes),
    memoryMB: parseFloat((memoryBytes / (1024 * 1024)).toFixed(2)),
    totalKeys: Math.round(totalKeys),
    gatewayStatus: gatewayStatus === 1 ? 'UP' : 'DOWN',
    clusterStatus: clusterStatus === 1 ? 'Healthy' : 'Degraded'
  };
}

/**
 * Get historical time-series chart data
 */
async function getRangeData() {
  const [requestRate, hitRatioSeries, memorySeries, activeNodesSeries] = await Promise.all([
    queryRange('sum(rate(gateway_requests_total[1m]))'),
    queryRange('avg(cache_hit_ratio)'),
    queryRange('sum(cache_memory_usage_bytes)'),
    queryRange('cluster_active_nodes')
  ]);

  return {
    requestRate,
    hitRatio: hitRatioSeries.map(item => ({ ...item, value: parseFloat((item.value * 100).toFixed(1)) })),
    memoryUsage: memorySeries.map(item => ({ ...item, value: parseFloat((item.value / (1024 * 1024)).toFixed(2)) })),
    activeNodes: activeNodesSeries
  };
}

module.exports = {
  getOverview,
  getRangeData,
  queryInstant,
  queryRange
};
