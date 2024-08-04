import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { useAuth } from '../Provider/authProvider';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ url, children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [errorSocket, setErrorSocket] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [errorReconnect, setErrorReconnect] = useState(false);
  const socketRef = useRef(null);
  const { token, user } = useAuth();

  const connectSocket = useCallback((passedToken) => {
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
      console.log('Socket connected', socketInstance.id);
      if (user) sendAddUser(user.user_id);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      setErrorSocket(null);
      console.log('Socket disconnected');
    });

    socketInstance.on('connect_error', (err) => {
      setErrorSocket('Connection error');
      setErrorReconnect(true);
      console.error('Connection error:', err);
    });

    socketInstance.on('error', (err) => {
      setErrorSocket('Socket error');
      setErrorReconnect(true);
      console.error('Socket error:', err);
    });

    socketInstance.on('reconnect_attempt', () => {
      console.log('Attempting to reconnect...');
    });

    socketInstance.on('reconnect_error', (err) => {
      console.error('Reconnection error:', err);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('Reconnection failed');
      setErrorReconnect(true);
    });

    socketInstance.on('shadowUpdateConnection', (data) => {
      setIsConnected(true);
      setErrorSocket(null);
      console.log('Shadow Update - Thing Connected:', data.shadow_connection);
      setRefresh(true);
    });
  }, [url, user]);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
      setErrorSocket(null);
      console.log('Socket disconnected manually');
    }
  }, []);

  useEffect(() => {
    if (token) {
      connectSocket(token);
    }

    return () => {
      disconnectSocket();
    };
  }, [connectSocket, disconnectSocket, token]);

  const sendAddUser = useCallback((user_id) => {
    if (socketRef.current) {
      socketRef.current.emit('addUser', user_id, (response) => {
        if (response.error) {
          setErrorSocket('Add user error');
          console.error('Add user error:', response.message);
        } else {
          setErrorSocket(null);
          console.log('User added:', user_id);
        }
      });
    } else {
      setErrorSocket('Socket is not connected');
      console.error('Socket is not connected');
    }
  }, [isConnected]);

  const sendRemoveUser = useCallback((user_id) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('removeUser', user_id, (response) => {
        if (response.error) {
          setErrorSocket('Remove user error');
          console.error('Remove user error:', response.message);
        } else {
          setErrorSocket(null);
          console.log('User removed:', user_id);
          disconnectSocket();
        }
      });
    } else {
      setErrorSocket('Socket is not connected');
      console.error('Socket is not connected');
    }
  }, [isConnected, disconnectSocket]);

  const sendCheckSocket = useCallback((user_id) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('checkSocket', user_id, (response) => {
        if (response.error) {
          setErrorSocket(response.message);
          console.error('Check Socket Error:', response.message);
          setIsConnected(false);
        } else {
          setErrorSocket(null);
          console.log('Socket check returned current socket up to date for user:', user_id);
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

