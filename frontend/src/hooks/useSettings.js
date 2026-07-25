import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '../api/services/settingsService';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const useGetSettings = (options = {}) => {
    return useQuery({
      queryKey: ['settings'],
      queryFn: settingsService.getSettings,
      ...options
    });
  };

  const useUpdateSettings = () => {
    return useMutation({
      mutationFn: settingsService.updateSettings,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['settings'] });
      }
    });
  };

  return {
    useGetSettings,
    useUpdateSettings
  };
};
