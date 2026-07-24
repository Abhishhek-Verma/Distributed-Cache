'use strict';

require('dotenv').config();

const express = require('express');
const config = require('./config');

const app = express();

app.use(express.json());

/**
 * GET /api/v1/health
 * Health check endpoint.
 * Follows API.md Section 7.1.
 */
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
  });
});

/**
 * Centralized error handler.
 * Never exposes internal errors to clients.
 * Follows Rules.md Section 6.
 */
app.use((err, req, res, next) => {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [cluster-manager] Error: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

app.listen(config.port, () => {
  console.log(
    `[${new Date().toISOString()}] [cluster-manager] Cluster Manager started on port ${config.port}`
  );
  console.log(
    `[${new Date().toISOString()}] [cluster-manager] Replication factor: ${config.replicationFactor}`
  );
  console.log(
    `[${new Date().toISOString()}] [cluster-manager] Virtual nodes per physical node: ${config.virtualNodesPerPhysical}`
  );
});

module.exports = app;
