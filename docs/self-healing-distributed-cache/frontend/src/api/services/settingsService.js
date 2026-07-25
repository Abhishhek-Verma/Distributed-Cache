import axiosInstance from '../axiosInstance';

export const settingsService = {
  /**
   * Get cluster and dashboard settings
   */
  getSettings: async () => {
    const response = await axiosInstance.get('/settings');
    return response.data;
  },

  /**
   * Update settings
   * @param {Object} payload - { gatewayUrl, pollingInterval, memThreshold, replicationFactor }
   */
  updateSettings: async (payload) => {
    const response = await axiosInstance.put('/settings', payload);
    return response.data;
  }
};
