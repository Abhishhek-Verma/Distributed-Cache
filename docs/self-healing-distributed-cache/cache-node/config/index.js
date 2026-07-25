const heartbeatInterval = rawHeartbeatInterval !== undefined ? parseInt(rawHeartbeatInterval, 10) : 5000;

const config = {
  port,
  nodeId: process.env.NODE_ID || 'node-unknown',
  clusterManagerUrl: process.env.CLUSTER_MANAGER_URL || 'http://localhost:8082',
  defaultTtl,
  maxCacheSize,
  heartbeatInterval,
};

if (Number.isNaN(config.port) || config.port <= 0) {
  throw new Error("Invalid PORT: must be a positive integer.");
}
if (Number.isNaN(config.defaultTtl) || config.defaultTtl <= 0) {
  throw new Error("Invalid DEFAULT_TTL: must be a positive integer.");
}
if (Number.isNaN(config.maxCacheSize) || config.maxCacheSize <= 0) {
  throw new Error("Invalid MAX_CACHE_SIZE: must be a positive integer.");
}
if (Number.isNaN(config.heartbeatInterval) || config.heartbeatInterval <= 0) {
  throw new Error("Invalid HEARTBEAT_INTERVAL: must be a positive integer.");
}

module.exports = config; 'use strict';

require('dotenv').config();

const rawPort = process.env.PORT;
const port = rawPort !== undefined ? parseInt(rawPort, 10) : 5001;

const rawDefaultTtl = process.env.DEFAULT_TTL;
const defaultTtl = rawDefaultTtl !== undefined ? parseInt(rawDefaultTtl, 10) : 300;

const rawMaxCacheSize = process.env.MAX_CACHE_SIZE;
const maxCacheSize = rawMaxCacheSize !== undefined ? parseInt(rawMaxCacheSize, 10) : 1000;

const rawHeartbeatInterval = process.env.HEARTBEAT_INTERVAL;

