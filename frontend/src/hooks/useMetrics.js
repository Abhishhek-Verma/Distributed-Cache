import { useQuery } from '@tanstack/react-query';
import { metricsService } from '../api/services/metricsService';

export const useMetrics = () => {
  const useGetMetricsOverview = (options = {}) => {
    return useQuery({
      queryKey: ['metrics', 'overview'],
      queryFn: metricsService.getOverview,
      refetchInterval: 5000,
      ...options
    });
  };

  const useGetMetricsRange = (options = {}) => {
    return useQuery({
      queryKey: ['metrics', 'range'],
      queryFn: metricsService.getRange,
      refetchInterval: 5000,
      ...options
    });
  };

  return {
    useGetMetricsOverview,
    useGetMetricsRange
  };
};
