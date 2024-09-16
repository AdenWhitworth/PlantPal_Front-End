import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';
import { postRefreshAccessToken } from '../Services/ApiService';

interface SocketContextType {
  isConnected: boolean;
  errorSocket: string | null;
  refresh: boolean;
  errorReconnect: boolean;
  setErrorReconnect: React.Dispatch<React.SetStateAction<boolean>>;
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  sendAddUser: (user_id: string) => void;
  sendRemoveUser: (user_id: string) => void;
  sendCheckSocket: (user_id: string) => void;
  connectSocket: (passedToken: string) => void;
  disconnectSocket: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  url: string;
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ url, children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [errorSocket, setErrorSocket] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [errorReconnect, setErrorReconnect] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { accessToken, setAccessToken, user } = useAuth();

  const handleRefreshAccessToken = useCallback(async () => {
    try {
      const response = await postRefreshAccessToken();
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);
    } catch (error: any) {
      console.error('Failed to refresh token', error);
    }
  }, [setAccessToken]);

  const sendAddUser = useCallback((user_id: string) => {
    if (socketRef.current) {
      socketRef.current.emit('addUser', user_id, (response: any) => {
        if (response.error) {
          setErrorSocket('Add user error');
          console.error('Add user error:', response.message);
        } else {
          setErrorSocket(null);
        }
      });
    } else {
      setErrorSocket('Socket is not connected');
      console.error('Socket is not connected');
    }
  }, []);

  const connectSocket = useCallback((passedToken: string) => {
    if (socketRef.current) return;

    const socketInstance = io(url, {
      auth: { token: passedToken },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socketRef.current = socketInstance;

    socketInstance.on('connect', () => {
      setIsConnected(true);
      setErrorSocket(null);
      if (user) sendAddUser(user.user_id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setErrorSocket(null);
    });

    socketInstance.on('connect_error', (err) => {
      setErrorSocket('Connection error');
      console.error('Connection error:', err);

      if (err.message === "Please provide the access token."){
        handleRefreshAccessToken();
      }
    });

    socketInstance.on('error', (err) => {
      setErrorSocket('Socket error');
      setErrorReconnect(true);
      console.error('Socket error:', err);
    });

    socketInstance.on('reconnect_attempt', () => {
    });

    socketInstance.on('reconnect_error', (err) => {
      console.error('Reconnection error:', err);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      setErrorReconnect(true);
    });

    socketInstance.on('presenceUpdateConnection', (data) => {
      setIsConnected(true);
      setErrorSocket(null);
      setRefresh(true);
    });

    socketInstance.on('shadowUpdatePumpWater', (data) => {
      setIsConnected(true);
      setErrorSocket(null);
      setRefresh(true);
    });

    socketInstance.on('shadowUpdateAuto', (data) => {
      setIsConnected(true);
      setErrorSocket(null);
      setRefresh(true);
    });

  }, [url, user, handleRefreshAccessToken, sendAddUser]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setErrorSocket(null);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      disconnectSocket();
      connectSocket(accessToken);
    }

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket, accessToken]);

  const sendRemoveUser = useCallback((user_id: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('removeUser', user_id, (response: any) => {
        if (response.error) {
          setErrorSocket('Remove user error');
          console.error('Remove user error:', response.message);
        } else {
          setErrorSocket(null);
          disconnectSocket();
        }
      });
    } else {
      setErrorSocket('Socket is not connected');
      console.error('Socket is not connected');
    }
  }, [isConnected, disconnectSocket]);

  const sendCheckSocket = useCallback((user_id: string) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('checkSocket', user_id, (response: any) => {
        if (response.error) {
          setErrorSocket(response.message);
          console.error('Check Socket Error:', response.message);
          setIsConnected(false);
        } else {
          setErrorSocket(null);
        }
      });
    } else {
      setErrorSocket('Socket is not connected');
      setIsConnected(false);
      console.error('Socket is not connected');
    }
  }, [isConnected]);

  return (
    <SocketContext.Provider value={{
      isConnected, errorSocket, refresh, errorReconnect, setErrorReconnect, setRefresh,
      sendAddUser, sendRemoveUser, sendCheckSocket, connectSocket, disconnectSocket
    }}>
      {children}
    </SocketContext.Provider>
  );
};

