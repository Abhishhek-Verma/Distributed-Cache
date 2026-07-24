'use strict';

require('dotenv').config();

const express = require('express');
const config = require('./config');
const cacheRoutes = require('./cache/cacheRoutes');
const nodeRoutes = require('./node/nodeRoutes');
const nodeInfo = require('./node/nodeInfo');
const heartbeatClient = require('./node/heartbeatClient');
const ttlManager = require('./ttl/ttlManager');
const cacheEngine = require('./cache/cacheEngine');
const metricsService = require('./monitoring/metricsService');

const app = express();

app.use(express.json());

// Exclude health and metrics paths from request counter
app.use((req, res, next) => {
  if (
    req.path !== '/health' &&
    req.path !== '/api/v1/health' &&
    req.path !== '/metrics'
  ) {
    metricsService.incrementRequests();
  }
  next();
});

/**
 * GET /metrics
 * Expose Prometheus-compatible metrics.
 * Follows Phase 10 Requirements.
 */
app.get('/metrics', (req, res) => {
  const stats = cacheEngine.getStats();
  const metrics = metricsService.getPrometheusMetrics(stats.size);
  res.set('Content-Type', 'text/plain');
  res.send(metrics);
});

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * Cache CRUD endpoints — Phase 2.
 * POST   /api/v1/cache        → SET
 * GET    /api/v1/cache/:key   → GET
 * DELETE /api/v1/cache/:key   → DELETE
 * Follows API.md Sections 5.1, 5.2, 5.3.
 */
app.use('/api/v1/cache', cacheRoutes);

/**
 * Node identity endpoints — Phase 3.
 * GET /api/v1/node/info → Full CacheNode model for this node.
 * Follows Architecture.md — CacheNode data model.
 */
app.use('/api/v1/node', nodeRoutes);

/**
 * GET /health
 * Root health check endpoint for Docker Compose.
 */
app.get('/health', (req, res) => {
  const info = nodeInfo.getNodeInfo();
  res.status(200).json({
    status: 'UP',
    service: 'cache-node',
    nodeId: info.id
  });
});

/**
 * GET /api/v1/health
 * Health check endpoint.
 * Returns full CacheNode status including Phase 3 identity fields.
 * Follows API.md Section 7.1.
 */
app.get('/api/v1/health', (req, res) => {
  const info = nodeInfo.getNodeInfo();
  const stats = cacheEngine.getStats();
  res.status(200).json({
    status: info.status,
    nodeId: info.id,
    host: info.host,
    port: info.port,
    role: info.role,
    cacheSize: stats.size,
    maxCacheSize: stats.maxSize,
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
  console.error(`[${new Date().toISOString()}] [${config.nodeId}] Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// ─── Server Startup ───────────────────────────────────────────────────────────

const server = app.listen(config.port, () => {
  const info = nodeInfo.getNodeInfo();
  const separator = '─'.repeat(50);

  console.log(`[${new Date().toISOString()}] [${info.id}] ${separator}`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Cache Node ONLINE`);
  console.log(`[${new Date().toISOString()}] [${info.id}] ${separator}`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Node ID       : ${info.id}`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Host          : ${info.host}`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Port          : ${info.port}`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Status        : ${info.status}`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Role          : ${info.role}`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Max Cache Size: ${config.maxCacheSize} entries`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Default TTL   : ${config.defaultTtl}s`);
  console.log(`[${new Date().toISOString()}] [${info.id}] Cluster Mgr   : ${config.clusterManagerUrl}`);
  console.log(`[${new Date().toISOString()}] [${info.id}] ${separator}`);

  // Start background TTL expiration cleanup — Phase 2
  ttlManager.start();

  // Phase 7: Start sending heartbeats to the Cluster Manager
  heartbeatClient.startHeartbeat();
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

/**
 * Stop the TTL timer and close the HTTP server cleanly on SIGTERM/SIGINT.
 * Prevents the Node.js process from hanging after Docker stops the container.
 */
function shutdown() {
  console.log(`[${new Date().toISOString()}] [${config.nodeId}] Signal received — shutting down`);
  ttlManager.stop();
  heartbeatClient.stopHeartbeat();
  server.close(() => {
    console.log(`[${new Date().toISOString()}] [${config.nodeId}] Server closed`);
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;

