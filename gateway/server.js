'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const metricsService = require('./services/metricsService');

const app = express();

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json());

// Metrics middleware
app.use((req, res, next) => {
  if (req.path !== '/metrics' && req.path !== '/health' && req.path !== '/api/v1/health') {
    metricsService.incrementRequests();
  }
  next();
});

// Root health check endpoint for Docker Compose
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', service: 'gateway' });
});

// Prometheus metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(metricsService.getPrometheusMetrics());
});

// Mount all versioned routes under /api/v1
app.use('/api/v1', routes);

// Centralized error handler — must be last middleware
app.use(errorHandler);

const server = app.listen(config.port, () => {
  console.log(
    `[${new Date().toISOString()}] [gateway] API Gateway started on port ${config.port}`
  );
  console.log(
    `[${new Date().toISOString()}] [gateway] Cluster Manager URL: ${config.clusterManagerUrl}`
  );
});

// ─── Graceful Shutdown ────────────────────────────────────────────────────────

function shutdown() {
  console.log(`[${new Date().toISOString()}] [gateway] Signal received — shutting down`);
  server.close(() => {
    console.log(`[${new Date().toISOString()}] [gateway] Server closed`);
    process.exit(0);
  });
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
