import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools'  
import AppRoutes from './routes';
import SocketProvider from './components/contexts/socket/SocketProvider';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>      
    </QueryClientProvider>
  );
}

export default App;
