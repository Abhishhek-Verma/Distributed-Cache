'use strict';

const nodeRegistryService = require('../node-manager/nodeRegistryService');

let requestsTotal = 0;

function incrementRequests() {
  requestsTotal++;
}

/**
 * Generate Prometheus-compatible text metrics for the Cluster Manager.
 * Follows Phase 10 Requirements:
 * - Active Nodes
 * - Failed Nodes
 * - Cluster Requests
 * - Cluster Status
 * 
 * @returns {string} Prometheus metrics payload
 */
function getPrometheusMetrics() {
  const activeNodesCount = nodeRegistryService.getActiveNodes().length;
  // To get failed nodes, we count OFFLINE status
  const allNodes = nodeRegistryService.getAllNodes();
  const failedNodesCount = allNodes.filter(
    n => n.status === nodeRegistryService.NODE_STATUS.OFFLINE
  ).length;

  const clusterStatus = activeNodesCount >= 2 ? 1 : 0; // 1 = UP, 0 = DEGRADED/DOWN

  return `
# HELP cluster_active_nodes Number of healthy cache nodes in the cluster
# TYPE cluster_active_nodes gauge
cluster_active_nodes ${activeNodesCount}

# HELP cluster_failed_nodes Number of failed (offline) cache nodes
# TYPE cluster_failed_nodes gauge
cluster_failed_nodes ${failedNodesCount}

# HELP cluster_requests_total Total number of HTTP requests processed by the cluster manager
# TYPE cluster_requests_total counter
cluster_requests_total ${requestsTotal}

# HELP cluster_status Overall health of the cluster (1=healthy, 0=degraded)
# TYPE cluster_status gauge
cluster_status ${clusterStatus}
`.trim();
}

module.exports = {
  incrementRequests,
  getPrometheusMetrics
};
