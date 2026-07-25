'use strict';

let requestsTotal = 0;

function incrementRequests() {
  requestsTotal++;
}

/**
 * Generate Prometheus-compatible text metrics.
 * Follows Phase 10 Requirements:
 * - Expose metrics endpoints for Prometheus scraping.
 * 
 * @returns {string} Prometheus metrics payload
 */
function getPrometheusMetrics() {
  return `
# HELP gateway_requests_total Total number of HTTP requests processed by the API gateway
# TYPE gateway_requests_total counter
gateway_requests_total ${requestsTotal}

# HELP gateway_status Status of the API gateway (1=UP)
# TYPE gateway_status gauge
gateway_status 1
`.trim() + '\n';
}

module.exports = {
  incrementRequests,
  getPrometheusMetrics
};
