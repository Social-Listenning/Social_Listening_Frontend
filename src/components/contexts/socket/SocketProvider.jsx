import { useState, createContext, useContext } from 'react';
import io from 'socket.io-client';
import environment from '../../../constants/environment/environment.dev';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  const connect = () => {
    if (socket && socket.connected) {
      return;
    }

    const token = localStorage.getItem('token');
    const sk = io(environment.webSocket, {
      transports: ['websocket'],
      autoConnect: false,
    });

    if (token) {
      sk.auth = { token };
      sk.connect();
      setSocket(sk);
      console.log('Connect to socket');
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.close();
      console.log('Disconnect to socket');
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);

export default SocketProvider;
