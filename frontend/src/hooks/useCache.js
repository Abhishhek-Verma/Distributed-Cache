import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cacheService } from '../api/services/cacheService';

export const useCache = () => {
  const queryClient = useQueryClient();

  // Export keys query
  const useExportCache = (options = {}) => {
    return useQuery({
      queryKey: ['cache', 'export'],
      queryFn: cacheService.exportCache,
      ...options
    });
  };

  // Get specific key query
  const useGetCache = (key, options = {}) => {
    return useQuery({
      queryKey: ['cache', key],
      queryFn: () => cacheService.getCache(key),
      enabled: !!key,
      ...options
    });
  };

  // Store cache mutation
  const useStoreCache = () => {
    return useMutation({
      mutationFn: cacheService.storeCache,
      onSuccess: () => {
        // Invalidate both the export list and specific keys if needed
        queryClient.invalidateQueries({ queryKey: ['cache'] });
      }
    });
  };

  // Delete cache mutation
  const useDeleteCache = () => {
    return useMutation({
      mutationFn: cacheService.deleteCache,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['cache'] });
      }
    });
  };

  return {
    useExportCache,
    useGetCache,
    useStoreCache,
    useDeleteCache
  };
};
