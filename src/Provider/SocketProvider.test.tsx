import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { SocketProvider, useSocket } from './SocketProvider';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthProvider';
import { postRefreshAccessToken } from '../Services/ApiService';

jest.mock('socket.io-client', () => {
    const mockSocket = {
      on: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
      connect: jest.fn(),
    };
    return {
      io: jest.fn(() => mockSocket),
    };
});

jest.mock('./AuthProvider', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../Services/ApiService', () => ({
  postRefreshAccessToken: jest.fn(),
}));

describe('SocketProvider', () => {
    const mockUser = { user_id: '123' };
    const mockAccessToken = 'token123';
    let mockSocketEmit: jest.Mock;
    let mockSocketDisconnect: jest.Mock;
    let mockSocketOn: jest.Mock;
    
    beforeEach(() => {
        jest.clearAllMocks();
        
        (useAuth as jest.Mock).mockReturnValue({
            accessToken: mockAccessToken,
            user: mockUser,
            setAccessToken: jest.fn(),
        });
        
        const mockSocket = io() as unknown as Socket;
        mockSocketEmit = mockSocket.emit as jest.Mock;
        mockSocketDisconnect = mockSocket.disconnect as jest.Mock;
        mockSocketOn = mockSocket.on as jest.Mock;

        //mockSocketEmit.mockClear();
        //mockSocketDisconnect.mockClear();
        
    });

    const TestComponent: React.FC = () => {
        const { connectSocket, sendAddUser, sendRemoveUser, isConnected } = useSocket();
        
        return (
        <div>
            <button onClick={() => connectSocket(mockAccessToken)}>Connect</button>
            <button onClick={() => sendAddUser(mockUser.user_id)}>Add User</button>
            <button onClick={() => sendRemoveUser(mockUser.user_id)}>Remove User</button>
            <div>{isConnected ? 'Connected' : 'Not Connected'}</div>
        </div>
        );
    };

    test('connects the socket on button click', () => {
        render(
            <SocketProvider url="http://localhost">
                <TestComponent />
            </SocketProvider>
        );

        act(() => {
            screen.getByText('Connect').click();
        });

        expect(io).toHaveBeenCalledWith('http://localhost', expect.anything());
        expect(mockSocketOn).toHaveBeenCalled();
    });

    test('handles addUser and removeUser socket events', async () => {
        // Render the component
        render(
          <SocketProvider url="http://localhost">
            <TestComponent />
          </SocketProvider>
        );
    
        // Simulate connecting the socket (trigger the 'connect' event)
        fireEvent.click(screen.getByText('Connect'));
    
        // Simulate the socket 'connect' event to set isConnected to true
        act(() => {
          mockSocketOn.mock.calls.forEach(([event, handler]) => {
            if (event === 'connect') {
              handler(); // Call the handler for the 'connect' event
            }
          });
        });
    
        // Wait for the UI to reflect the "Connected" state
        await waitFor(() => {
          expect(screen.getByText('Connected')).toBeInTheDocument();
        });
    
        // Simulate adding a user
        fireEvent.click(screen.getByText('Add User'));
    
        // Wait for the 'addUser' event to be emitted
        await waitFor(() => {
          expect(mockSocketEmit).toHaveBeenCalledWith('addUser', '123', expect.any(Function));
        });
        /*
        act(() => {
            fireEvent.click(screen.getByText('Remove User'));
        });
        
    
        // Wait for the 'removeUser' event to be emitted and the socket to be disconnected
        await waitFor(() => {
          expect(mockSocketEmit).toHaveBeenCalledWith('removeUser', '123', expect.any(Function));
          expect(mockSocketDisconnect).toHaveBeenCalled();
        });

        */

    });

    test('handles removeUser socket event and disconnects the socket', async () => {
        render(
          <SocketProvider url="http://localhost">
            <TestComponent />
          </SocketProvider>
        );

        fireEvent.click(screen.getByText('Connect'));

        act(() => {
          mockSocketOn.mock.calls.forEach(([event, handler]) => {
            if (event === 'connect') {
              handler(); // Call the handler for the 'connect' event
            }
          });
        });

        await waitFor(() => {
          expect(screen.getByText('Connected')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByText('Remove User'));

        await waitFor(() => {
          expect(mockSocketEmit).toHaveBeenCalledWith('removeUser', '123', expect.any(Function));
        });

        // Simulate successful callback for 'removeUser'
        act(() => {
        const callback = mockSocketEmit.mock.calls.find(call => call[0] === 'removeUser')?.[2];
        if (callback) {
          callback({}); // Simulate successful response with no error
        }
      });

        await waitFor(() => {
            expect(mockSocketDisconnect).toHaveBeenCalled();
        });
    });

    test('disconnects the socket and handles errors', () => {
        render(
            <SocketProvider url="http://localhost">
                <TestComponent />
            </SocketProvider>
        );

        act(() => {
            screen.getByText('Connect').click();
        });

        act(() => {
            mockSocketOn.mock.calls.find(call => call[0] === 'disconnect')[1]();
        });

        expect(screen.getByText('Not Connected')).toBeInTheDocument();
    });
    
    test('handles connection errors and refreshes token', async () => {
        const mockNewAccessToken = 'newToken123';
        
        (postRefreshAccessToken as jest.Mock).mockResolvedValue({
            data: { accessToken: mockNewAccessToken },
        });

        render(
            <SocketProvider url="http://localhost">
                <TestComponent />
            </SocketProvider>
        );

        act(() => {
            mockSocketOn.mock.calls.find(call => call[0] === 'connect_error')[1]({
                message: 'Please provide the access token.',
            });
        });

        expect(postRefreshAccessToken).toHaveBeenCalled();
    });

    test('throws an error when useSocket is used outside of SocketProvider', () => {
        const TestErrorComponent = () => {
            useSocket();
            return <div>Test</div>;
        };

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        expect(() => render(<TestErrorComponent />)).toThrow('useSocket must be used within a SocketProvider');

        consoleErrorSpy.mockRestore();
    });
});
