import React, { ReactNode } from 'react';

/**
 * Represents the context provided by the SocketProvider.
 * 
 * @interface SocketContextType
 * @property {boolean} isConnected - Indicates whether the socket is currently connected.
 * @property {string | null} errorSocket - Error message related to the socket connection, if any.
 * @property {boolean} refresh - Indicates whether the socket should refresh its connection.
 * @property {boolean} errorReconnect - Indicates if there's an error in reconnecting to the socket.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setErrorReconnect - Function to update the errorReconnect state.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setRefresh - Function to update the refresh state.
 * @property {(user_id: string) => void} sendAddUser - Sends a request to add a user to the socket.
 * @property {(user_id: string) => void} sendRemoveUser - Sends a request to remove a user from the socket.
 * @property {(user_id: string) => void} sendCheckSocket - Sends a request to check the socket status for a specific user.
 * @property {(passedToken: string) => void} connectSocket - Establishes a socket connection using the provided token.
 * @property {() => void} disconnectSocket - Disconnects the current socket connection.
 */
export interface SocketContextType {
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

/**
 * Props for the SocketProvider component.
 * 
 * @interface SocketProviderProps
 * @property {string} url - The URL to connect the socket.
 * @property {ReactNode} children - The child components that will have access to the socket context.
 */
export interface SocketProviderProps {
    url: string;
    children: ReactNode;
}