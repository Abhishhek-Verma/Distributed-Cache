import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clusterService } from '../api/services/clusterService';

export const useCluster = () => {
  const queryClient = useQueryClient();

  const useGetClusterInfo = (options = {}) => {
    return useQuery({
      queryKey: ['cluster', 'info'],
      queryFn: clusterService.getClusterInfo,
      refetchInterval: 5000,
      ...options
    });
  };

  const useGetClusterNodes = (options = {}) => {
    return useQuery({
      queryKey: ['cluster', 'nodes'],
      queryFn: clusterService.getClusterNodes,
      refetchInterval: 5000,
      ...options
    });
  };

  const useRegisterNode = () => {
    return useMutation({
      mutationFn: clusterService.registerNode,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cluster'] });
      }
    });
  };

  const useRemoveNode = () => {
    return useMutation({
      mutationFn: clusterService.removeNode,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cluster'] });
      }
    });
  };

  const useGetHealth = (options = {}) => {
    return useQuery({
      queryKey: ['health'],
      queryFn: clusterService.getHealth,
      refetchInterval: 5000,
      ...options
    });
  };

  return {
    useGetClusterInfo,
    useGetClusterNodes,
    useRegisterNode,
    useRemoveNode,
    useGetHealth
  };
};
