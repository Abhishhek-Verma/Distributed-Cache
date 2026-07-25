import axiosInstance from '../axiosInstance';

export const logService = {
  /**
   * Fetch backend system logs
   */
  getLogs: async () => {
    const response = await axiosInstance.get('/logs');
    if (Array.isArray(response.data?.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  }
};
