import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RQ_STALE_TIME, RQ_GC_TIME, RQ_RETRY } from '../constants';

// -------------------------------------------------------------------
// React Query Client Configuration
// Memory.md section 9 — React Query Cache defaults
// StateManagement.md section 17 — QueryClientProvider responsibilities
// -------------------------------------------------------------------

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: RQ_STALE_TIME,
      gcTime: RQ_GC_TIME,
      retry: RQ_RETRY,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function ReactQueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

export { queryClient };
export default ReactQueryProvider;
