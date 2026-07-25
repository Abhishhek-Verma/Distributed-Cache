'use strict';

/**
 * In-memory settings store for API Gateway & Cluster parameters.
 */
let settings = {
  gatewayUrl: 'http://localhost:3000/api/v1',
  pollingInterval: 5000,
  memThreshold: 85,
  replicationFactor: 2,
};

/**
 * Get current settings.
 * @returns {Object}
 */
function getSettings() {
  return { ...settings };
}

/**
 * Update current settings.
 * @param {Object} newSettings
 * @returns {Object}
 */
function updateSettings(newSettings) {
  if (!newSettings || typeof newSettings !== 'object') {
    return settings;
  }
  settings = {
    gatewayUrl: newSettings.gatewayUrl || settings.gatewayUrl,
    pollingInterval: Number(newSettings.pollingInterval) || settings.pollingInterval,
    memThreshold: Number(newSettings.memThreshold) || settings.memThreshold,
    replicationFactor: Number(newSettings.replicationFactor) || settings.replicationFactor,
  };
  return { ...settings };
}

module.exports = {
  getSettings,
  updateSettings,
};
