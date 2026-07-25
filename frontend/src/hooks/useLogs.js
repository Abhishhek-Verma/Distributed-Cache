import { useQuery } from '@tanstack/react-query';
import { logService } from '../api/services/logService';

export const useLogs = (options = {}) => {
  return useQuery({
    queryKey: ['logs'],
    queryFn: logService.getLogs,
    refetchInterval: 3000,
    ...options
  });
};
