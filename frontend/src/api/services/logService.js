import axiosInstance from '../axiosInstance';

export const logService = {
  /**
   * Fetch backend system logs
   */
  getLogs: async () => {
    const response = await axiosInstance.get('/logs');
    return response.data;
  }
};
