import { QueryClient, QueryClientProvider } from 'react-query';
import AppRoutes from './routes';
import SocketProvider from './components/contexts/socket/SocketProvider';

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <AppRoutes />
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;
