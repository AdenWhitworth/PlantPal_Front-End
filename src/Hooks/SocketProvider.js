import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ url, options, children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  const connectSocket = useCallback(() => {
    if (socketRef.current) return; 

    try {
      const socketInstance = io(url, options);
      socketRef.current = socketInstance;

      socketInstance.on('connect', () => {
        setIsConnected(true);
        setError(null);
        console.log('Socket connected', socketInstance.id);
      });

      socketInstance.on('disconnect', () => {
        setIsConnected(false);
        setError(null);
        console.log('Connection Disconnected');
      });

      socketInstance.on('connect_error', (err) => {
        setError('Connection error');
        console.error('Connection error:', err);
      });

      socketInstance.on('error', (err) => {
        setError('Socket error');
        console.error('Socket error:', err);
      });

      socketInstance.on('shadowUpdate', (data) => {
        setIsConnected(true);
        setError(null);
        console.log('Shadow Update - Thing Connected: ', data.shadow_connection);
      });

    } catch (err) {
      setError('Failed to initialize socket');
      console.error('Failed to initialize socket:', err);
    }
  }, [url, options]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setIsConnected(false);
    setError(null);
    console.log('Socket disconnected manually');
  }, []);

  useEffect(() => {
    connectSocket();

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket]);

  const sendAddUser = useCallback((user_id) => {
    try {
      if (socketRef.current) {
        socketRef.current.emit('addUser', user_id, (response) => {
          if (response.error) {
            setError('Add user error');
            console.error('Add user error:', response.message);
            return;
          }

          setError(null);
          console.log('User added:', user_id);
        });
      } else {
        setError('Socket is not connected');
        console.error('Socket is not connected');
      }
    } catch (err) {
      setError('Failed to add user');
      console.error('Failed to add user:', err);
    }
  }, []);

  const sendRemoveUser = useCallback((user_id) => {
    try {
      if (socketRef.current) {
        socketRef.current.emit('removeUser', user_id, (response) => {
          if (response.error) {
            setError('Remove user error');
            console.error('Remove user error:', response.message);
            return;
          }

          setError(null);
          console.log('User Removed:', user_id);
        });
      } else {
        setError('Socket is not connected');
        console.error('Socket is not connected');
      }
    } catch (err) {
      setError('Failed to remove user');
      console.error('Failed to remove user:', err);
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected, error, sendAddUser, sendRemoveUser, connectSocket, disconnectSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
