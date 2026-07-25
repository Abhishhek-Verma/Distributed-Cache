'use strict';

/**
 * Centralized error handling middleware.
 * Logs every error with timestamp and service name.
 * Never exposes internal stack traces to the client.
 * Follows Rules.md Section 6 — Error Handling Rules.
 */
function errorHandler(err, req, res, next) {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] [gateway] Error: ${err.message}`);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
