import React, { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../AuthProvider/AuthProvider';
import { postRefreshAccessToken } from '../../Services/ApiService/ApiService';
import { SocketContextType, SocketProviderProps } from './SocketProviderTypes';

/**
 * Context for authentication state and actions.
 * @type {React.Context<SocketContextType | undefined>}
 */
const SocketContext: React.Context<SocketContextType | undefined> = createContext<SocketContextType | undefined>(undefined);

/**
 * Custom hook to use the SocketContext.
 * 
 * @returns {SocketContextType} The socket context value.
 * @throws {Error} Throws an error if used outside of a SocketProvider.
 */
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

/**
 * Provider component for managing socket connections and providing context to its children.
 * 
 * @param {SocketProviderProps} props - The properties for the SocketProvider.
 * @returns {JSX.Element} The rendered SocketProvider component.
 */
export const SocketProvider: React.FC<SocketProviderProps> = ({ url, children }: SocketProviderProps): JSX.Element => {
  const [isConnected, setIsConnected] = useState(false);
  const [errorSocket, setErrorSocket] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [errorReconnect, setErrorReconnect] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { accessToken, setAccessToken, user } = useAuth();

  /**
   * Handles refreshing the access token from the server.
   * 
   * @function
   */
  const handleRefreshAccessToken = useCallback(async () => {
    try {
      const response = await postRefreshAccessToken();
      const newAccessToken = response.data.accessToken;
      setAccessToken(newAccessToken);
    } catch (error: any) {
      console.error('Failed to refresh token', error);
    }
  }, [setAccessToken]);

  /**
   * Sends a request to add a user to the socket.
   * 
   * @function
   * @param {string} user_id - The ID of the user to add.
   */
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

  /**
   * Connects to the socket using the provided token.
   * 
   * @function
   * @param {string} passedToken - The token used for authentication.
   */
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

  /**
   * Disconnects the current socket connection.
   * 
   * @function
   */
  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setErrorSocket(null);
    }
  }, []);

  /**
   * Effect to manage the socket connection based on the access token.
   * 
   * If the access token changes, it disconnects the current socket (if connected)
   * and establishes a new connection using the updated token. It cleans up by
   * disconnecting the socket when the component is unmounted.
   */
  useEffect(() => {
    if (accessToken) {
      disconnectSocket();
      connectSocket(accessToken);
    }

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket, accessToken]);

  /**
   * Sends a request to remove a user from the socket.
   * 
   * @function 
   * @param {string} user_id - The ID of the user to remove.
   */
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

  /**
   * Sends a request to check the socket status for a specific user.
   * 
   * @function
   * @param {string} user_id - The ID of the user to check.
   */
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

