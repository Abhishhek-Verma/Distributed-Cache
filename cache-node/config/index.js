'use strict';

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 5001,
  nodeId: process.env.NODE_ID || 'node-unknown',
  clusterManagerUrl: process.env.CLUSTER_MANAGER_URL || 'http://localhost:8082',
  defaultTtl: parseInt(process.env.DEFAULT_TTL, 10) || 300,
  maxCacheSize: parseInt(process.env.MAX_CACHE_SIZE, 10) || 1000,
  heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL, 10) || 5000,
};

module.exports = config;
