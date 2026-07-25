import axiosInstance from '../axiosInstance';

export const metricsService = {
  /**
   * Fetch current Prometheus metrics summary
   */
  getOverview: async () => {
    const response = await axiosInstance.get('/metrics/overview');
    return response.data;
  },

  /**
   * Fetch historical Prometheus time-series metric data
   */
  getRange: async () => {
    const response = await axiosInstance.get('/metrics/range');
    return response.data;
  }
};
