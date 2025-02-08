import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WebSocketProvider } from './contexts/WebSocketContext';

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;