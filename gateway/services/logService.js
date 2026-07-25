'use strict';

/**
 * In-memory circular buffer for backend system logs.
 * Stores up to MAX_LOGS recent log entries.
 */
const MAX_LOGS = 100;
const logs = [];

/**
 * Add a log entry to the buffer.
 * @param {'INFO'|'WARN'|'ERROR'} level
 * @param {string} component
 * @param {string} message
 */
function addLog(level, component, message) {
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    level: level.toUpperCase(),
    component,
    message,
  };
  logs.unshift(entry);
  if (logs.length > MAX_LOGS) {
    logs.pop();
  }
}

/**
 * Get all current log entries.
 * @returns {Array}
 */
function getLogs() {
  return logs;
}

// Record initial startup log
addLog('INFO', 'gateway', 'API Gateway logger initialized successfully');

module.exports = {
  addLog,
  getLogs,
};
