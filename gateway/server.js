'use strict';

require('dotenv').config();

const express = require('express');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.use(express.json());

// Mount all versioned routes under /api/v1
app.use('/api/v1', routes);

// Centralized error handler — must be last middleware
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(
    `[${new Date().toISOString()}] [gateway] API Gateway started on port ${config.port}`
  );
  console.log(
    `[${new Date().toISOString()}] [gateway] Cluster Manager URL: ${config.clusterManagerUrl}`
  );
});

module.exports = app;
