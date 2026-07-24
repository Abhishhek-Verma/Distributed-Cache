'use strict';

require('dotenv').config();

const config = {
  port: parseInt(process.env.PORT, 10) || 3000,
  clusterManagerUrl: process.env.CLUSTER_MANAGER_URL || 'http://localhost:8082',
};

module.exports = config;
