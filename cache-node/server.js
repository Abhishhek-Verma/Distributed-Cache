'use strict';

require('dotenv').config();

const express = require('express');
const config = require('./config');
const cacheRoutes = require('./cache/cacheRoutes');
const nodeRoutes = require('./node/nodeRoutes');
const nodeInfo = require('./node/nodeInfo');
const ttlManager = require('./ttl/ttlManager');
const cacheEngine = require('./cache/cacheEngine');

const app = express();

app.use(express.json());

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
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

/**
 * Stop the TTL timer and close the HTTP server cleanly on SIGTERM.
 * Prevents the Node.js process from hanging after Docker stops the container.
 */
process.on('SIGTERM', () => {
  console.log(`[${new Date().toISOString()}] [${config.nodeId}] SIGTERM received — shutting down`);
  ttlManager.stop();
  server.close(() => {
    console.log(`[${new Date().toISOString()}] [${config.nodeId}] Server closed`);
    process.exit(0);
  });
});

module.exports = app;

