'use strict';

require('dotenv').config();

const express = require('express');
const config = require('./config');
const clusterRoutes = require('./routing/clusterRoutes');
const cacheProxyRoutes = require('./routing/cacheProxyRoutes');
const nodeRegistryService = require('./node-manager/nodeRegistryService');
const heartbeatService = require('./node-manager/heartbeatService');
const metricsService = require('./monitoring/metricsService');

const app = express();

app.use(express.json());

// Global Request Counter
app.use((req, res, next) => {
  metricsService.incrementRequests();
  next();
});

// ─── Monitoring ───────────────────────────────────────────────────────────────

/**
 * GET /metrics
 * Expose Prometheus-compatible metrics for the Cluster Manager.
 * Follows Phase 10 Requirements.
 */
app.get('/metrics', (req, res) => {
  const metrics = metricsService.getPrometheusMetrics();
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * Cluster management endpoints — Phase 4.
 * GET    /api/v1/cluster          → cluster info
 * GET    /api/v1/cluster/nodes    → list all nodes
 * POST   /api/v1/cluster/nodes    → register a node
 * DELETE /api/v1/cluster/nodes/:id → remove a node
 * Follows API.md §6.
 */
app.use('/api/v1/cluster', clusterRoutes);

/**
 * Cache proxy endpoints — Phase 4.
 * POST   /api/v1/cache       → proxied SET (routed to cache node)
 * GET    /api/v1/cache/:key  → proxied GET (routed to cache node)
 * DELETE /api/v1/cache/:key  → proxied DELETE (routed to cache node)
 * Follows API.md §5.
 */
app.use('/api/v1/cache', cacheProxyRoutes);

/**
 * GET /api/v1/health
 * Health check for the Cluster Manager.
 * Returns live cluster summary (total, healthy, failed nodes).
 * Follows API.md §7.1.
 */
app.get('/api/v1/health', (req, res) => {
  const clusterInfo = nodeRegistryService.getClusterInfo();
  res.status(200).json({
    status: 'UP',
    service: 'cluster-manager',
    ...clusterInfo,
    timestamp: new Date().toISOString(),
  });
});

// ─── Error Handler ────────────────────────────────────────────────────────────

/**
 * Centralized error handling middleware.
 * Must be registered after all routes.
 * Never exposes stack traces to clients.
 * Follows Rules.md Section 6 — Error Handling Rules.
 */
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] [cluster-manager] Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── Server Startup ───────────────────────────────────────────────────────────

const server = app.listen(config.port, () => {
  const separator = '─'.repeat(52);
  console.log(`[${new Date().toISOString()}] [cluster-manager] ${separator}`);
  console.log(`[${new Date().toISOString()}] [cluster-manager] Cluster Manager ONLINE`);
  console.log(`[${new Date().toISOString()}] [cluster-manager] ${separator}`);
  console.log(`[${new Date().toISOString()}] [cluster-manager] Port              : ${config.port}`);
  console.log(`[${new Date().toISOString()}] [cluster-manager] Replication Factor: ${config.replicationFactor}`);
  console.log(`[${new Date().toISOString()}] [cluster-manager] Virtual Nodes/Node: ${config.virtualNodesPerPhysical}`);
  console.log(`[${new Date().toISOString()}] [cluster-manager] Heartbeat Interval: ${config.heartbeatInterval}ms`);
  console.log(`[${new Date().toISOString()}] [cluster-manager] Heartbeat Timeout : ${config.heartbeatTimeout}ms`);
  console.log(`[${new Date().toISOString()}] [cluster-manager] ${separator}`);

  // Phase 7: Start monitoring cache node heartbeats
  heartbeatService.startMonitor();
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] [cluster-manager] SIGTERM — shutting down`);
  heartbeatService.stopMonitor();
  server.close(() => {
    console.log(`[${new Date().toISOString()}] [cluster-manager] Server closed`);
    process.exit(0);
  });
});

module.exports = app;

