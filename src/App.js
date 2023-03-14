import AppRoutes from './routes';
import SocketProvider from './components/socket/SocketProvider';

function App() {
  return (
    <SocketProvider>
      <AppRoutes />
    </SocketProvider>
  );
}

export default App;
