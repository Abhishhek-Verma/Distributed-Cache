import axiosInstance from '../axiosInstance';

export const clusterService = {
  /**
   * Get cluster summary info
   */
  getClusterInfo: async () => {
    const response = await axiosInstance.get('/cluster');
    return response.data;
  },

  /**
   * List all cache nodes in cluster
   */
  getClusterNodes: async () => {
    const response = await axiosInstance.get('/cluster/nodes');
    return response.data;
  },

  /**
   * Register a new cache node
   * @param {Object} payload - { id, host, port }
   */
  registerNode: async (payload) => {
    const response = await axiosInstance.post('/cluster/nodes', payload);
    return response.data;
  },

  /**
   * Remove a cache node by ID
   * @param {string} id
   */
  removeNode: async (id) => {
    const response = await axiosInstance.delete(`/cluster/nodes/${id}`);
    return response.data;
  },

  /**
   * Get Gateway health status
   */
  getHealth: async () => {
    const response = await axiosInstance.get('/health');
    return response.data;
  }
};
