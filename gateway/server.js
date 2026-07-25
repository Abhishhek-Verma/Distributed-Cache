'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');
const metricsService = require('./services/metricsService');

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
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

// Grafana Reverse Proxy — allows Grafana embedding over HTTPS tunnel
const http = require('http');
app.use('/grafana', (req, res) => {
  const targetHost = process.env.GRAFANA_HOST || 'grafana';
  const targetPort = process.env.GRAFANA_PORT || 3000;
  
  // Retain the /grafana prefix so Grafana's subpath router resolves correctly
  const path = req.originalUrl || `/grafana${req.url}`;

  const options = {
    hostname: targetHost,
    port: targetPort,
    path: path,
    method: req.method,
    headers: {
      ...req.headers,
      host: `${targetHost}:${targetPort}`
    }
  };

  const proxyReq = http.request(options, (proxyRes) => {
    const headers = { ...proxyRes.headers };
    delete headers['x-frame-options'];
    delete headers['content-security-policy'];
    res.writeHead(proxyRes.statusCode, headers);
    proxyRes.pipe(res, { end: true });
  });

  req.pipe(proxyReq, { end: true });

  proxyReq.on('error', (err) => {
    console.error('Grafana proxy error:', err.message);
    res.status(502).json({ error: 'Grafana proxy error', details: err.message });
  });
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
