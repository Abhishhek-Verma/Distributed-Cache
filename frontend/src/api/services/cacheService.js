import axiosInstance from '../axiosInstance';

export const cacheService = {
  /**
   * Get a cache entry by key
   * @param {string} key
   */
  getCache: async (key) => {
    if (!key || typeof key !== 'string' || !key.trim()) {
      return null;
    }
    const response = await axiosInstance.get(`/cache/${encodeURIComponent(key.trim())}`);
    return response.data;
  },

  /**
   * Store a cache entry
   * @param {Object} payload - { key, value, ttl }
   */
  storeCache: async (payload) => {
    const response = await axiosInstance.post('/cache', payload);
    return response.data;
  },

  /**
   * Delete a cache entry by key
   * @param {string} key
   */
  deleteCache: async (key) => {
    const response = await axiosInstance.delete(`/cache/${key}`);
    return response.data;
  },

  /**
   * Export all cache keys
   */
  exportCache: async () => {
    const response = await axiosInstance.get('/cache/_export');
    return response.data;
  }
};
