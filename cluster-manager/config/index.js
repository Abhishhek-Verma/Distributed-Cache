'use strict';

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 8082,
  replicationFactor: parseInt(process.env.REPLICATION_FACTOR, 10) || 2,
  virtualNodesPerPhysical: parseInt(process.env.VIRTUAL_NODES_PER_PHYSICAL, 10) || 150,
  heartbeatInterval: parseInt(process.env.HEARTBEAT_INTERVAL, 10) || 5000,
  heartbeatTimeout: parseInt(process.env.HEARTBEAT_TIMEOUT, 10) || 15000,
};

module.exports = config;
