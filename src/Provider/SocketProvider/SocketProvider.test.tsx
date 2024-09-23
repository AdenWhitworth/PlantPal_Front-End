import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { SocketProvider, useSocket } from './SocketProvider';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../AuthProvider/AuthProvider';
import { postRefreshAccessToken } from '../../Services/ApiService/ApiService';

//Mocking the socket.io-client
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

//Mocking the AuthProvider
jest.mock('../AuthProvider/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

//Mocking the AoiService
jest.mock('../../Services/ApiService/ApiService', () => ({
  postRefreshAccessToken: jest.fn(),
}));

/**
 * Tests the functionality of the SocketProvider component.
 */
describe('SocketProvider', () => {
    const mockUser = { user_id: '123' };
    const mockAccessToken = 'token123';
    let mockSocketEmit: jest.Mock;
    let mockSocketDisconnect: jest.Mock;
    let mockSocketOn: jest.Mock;

    /**
     * Test component to interact with the SocketProvider.
     * 
     * @returns {JSX.Element} The rendered TestComponent.
     */
    const TestComponent: React.FC = (): JSX.Element => {
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
    });

    /**
     * Tests that the socket connects on button click.
     */
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

    /**
     * Tests the handling of addUser and removeUser socket events.
     */
    test('handles addUser and removeUser socket events', async () => {
        render(
          <SocketProvider url="http://localhost">
            <TestComponent />
          </SocketProvider>
        );
    
        fireEvent.click(screen.getByText('Connect'));
    
        act(() => {
          mockSocketOn.mock.calls.forEach(([event, handler]) => {
            if (event === 'connect') {
              handler();
            }
          });
        });
    
        await waitFor(() => {
          expect(screen.getByText('Connected')).toBeInTheDocument();
        });
    
        fireEvent.click(screen.getByText('Add User'));
    
        await waitFor(() => {
          expect(mockSocketEmit).toHaveBeenCalledWith('addUser', '123', expect.any(Function));
        });
    });

    /**
     * Tests the handling of removeUser socket event and verifies the socket disconnection.
     */
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
              handler();
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

        act(() => {
        const callback = mockSocketEmit.mock.calls.find(call => call[0] === 'removeUser')?.[2];
        if (callback) {
          callback({});
        }
      });

        await waitFor(() => {
            expect(mockSocketDisconnect).toHaveBeenCalled();
        });
    });

    /**
     * Tests that the socket disconnects correctly and updates the connection status.
     */
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
    
    /**
     * Tests handling of connection errors and refreshing the access token.
     */
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

    /**
     * Tests that an error is thrown when useSocket is used outside of SocketProvider.
     */
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
