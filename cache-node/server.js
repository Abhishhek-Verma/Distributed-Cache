'use strict';

require('dotenv').config();

const express = require('express');
const config = require('./config');

const app = express();

app.use(express.json());

/**
 * GET /api/v1/health
 * Cache node health check.
 * Returns node identity, status, and timestamp.
 * Follows API.md Section 7.1.
 */
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    nodeId: config.nodeId,
    port: config.port,
    timestamp: new Date().toISOString(),
  });
});

/**
 * Centralized error handler.
 * Follows Rules.md Section 6 — Error Handling Rules.
 */
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [${config.nodeId}] Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(config.port, () => {
  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] Cache Node started on port ${config.port}`
  );
  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] Max cache size: ${config.maxCacheSize} entries`
  );
  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] Default TTL: ${config.defaultTtl}s`
  );
  console.log(
    `[${new Date().toISOString()}] [${config.nodeId}] Cluster Manager: ${config.clusterManagerUrl}`
  );
});

module.exports = app;
