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
  const mockSetAccessToken = jest.fn();

  /**
   * Test component to interact with the SocketProvider.
   * 
   * @returns {JSX.Element} The rendered TestComponent.
   */
  const TestComponent: React.FC = (): JSX.Element => {
    const { connectSocket, sendAddUser, sendRemoveUser, isConnected, errorReconnect, refresh, refreshShadow } = useSocket();
    
    return (
      <div>
        <button onClick={() => connectSocket(mockAccessToken)}>Connect</button>
        <button onClick={() => sendAddUser(mockUser.user_id)}>Add User</button>
        <button onClick={() => sendRemoveUser(mockUser.user_id)}>Remove User</button>
        <div>{isConnected ? 'Connected' : 'Not Connected'}</div>
        <div>{errorReconnect? "Error Reconnect" : "No Error Reconnect"}</div>
        <div>{refresh? "Refresh Device" : "No Refresh Device"}</div>
        <div>{refreshShadow? "Refresh Shadow" : "No Refresh Shadow"}</div>
      </div>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useAuth as jest.Mock).mockReturnValue({
      accessToken: mockAccessToken,
      user: mockUser,
      setAccessToken: mockSetAccessToken,
    });
    
    const mockSocket = io() as unknown as Socket;
    mockSocketEmit = mockSocket.emit as jest.Mock;
    mockSocketDisconnect = mockSocket.disconnect as jest.Mock;
    mockSocketOn = mockSocket.on as jest.Mock;
  });

  /**
   * Tests handling of socket connection events and updates the UI accordingly.
   */
  test('handles socket connection events', () => {
    render(
      <SocketProvider url="http://localhost">
        <TestComponent />
      </SocketProvider>
    );

    act(() => {
      screen.getByText('Connect').click();
    });

    act(() => {
      mockSocketOn.mock.calls.find(call => call[0] === 'connect')?.[1]();
    });

    expect(screen.getByText('Connected')).toBeInTheDocument();

    act(() => {
      mockSocketOn.mock.calls.find(call => call[0] === 'disconnect')?.[1]();
    });

    expect(screen.getByText('Not Connected')).toBeInTheDocument();
  });

  /**
   * Tests handling of socket connection error events and updates the UI accordingly.
   */
  test('handles connection error events', async () => {
    render(
      <SocketProvider url="http://localhost">
        <TestComponent />
      </SocketProvider>
    );

    act(() => {
      mockSocketOn.mock.calls.find(call => call[0] === 'connect_error')?.[1]({ message: 'error' });
    });

    expect(screen.getByText('Not Connected')).toBeInTheDocument();

    act(() => {
      mockSocketOn.mock.calls.find(call => call[0] === 'reconnect_error')?.[1]();
    });

    expect(screen.getByText('Not Connected')).toBeInTheDocument();
  });

  /**
   * Tests that the socket attempts to refresh the access token on connect_error with specific message.
   */
  test('calls refreshAccessToken on connect_error with "Please provide the access token."', async () => {
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

    expect(postRefreshAccessToken).toHaveBeenCalledTimes(1);

    await waitFor(() => {
      expect(mockSetAccessToken).toHaveBeenCalledWith(mockNewAccessToken);
    });
  });

  /**
   * Tests that refreshAccessToken is not called if a generic connect_error occurs.
   */
  test('does not call refreshAccessToken on other connect_error messages', () => {
    render(
      <SocketProvider url="http://localhost">
        <TestComponent />
      </SocketProvider>
    );

    act(() => {
      mockSocketOn.mock.calls.find(call => call[0] === 'connect_error')[1]({
        message: 'Something else went wrong.',
      });
    });

    expect(postRefreshAccessToken).not.toHaveBeenCalled();
  });

  /**
   * Tests socket reconnection failure handling.
   */
  test('handles reconnection failed event', async () => {
    render(
      <SocketProvider url="http://localhost">
        <TestComponent />
      </SocketProvider>
    );

    act(() => {
      mockSocketOn.mock.calls.find(call => call[0] === 'reconnect_failed')?.[1]();
    });

    expect(screen.getByText('Not Connected')).toBeInTheDocument();
    expect(screen.getByText('Error Reconnect')).toBeInTheDocument();
  });

  /**
   * Tests handling of the presenceUpdateConnection event.
   */
  test('handles custom events like presenceUpdateConnection', async () => {
      render(
        <SocketProvider url="http://localhost">
          <TestComponent />
        </SocketProvider>
      );

      act(() => {
        mockSocketOn.mock.calls.find(call => call[0] === 'presenceUpdateConnection')?.[1]({ data: 'test' });
      });

      expect(screen.getByText('Connected')).toBeInTheDocument();
      expect(screen.getByText('Refresh Device')).toBeInTheDocument();
  });

  /**
   * Tests handling of the shadowUpdatePumpWater event.
   */
  test('handles shadowUpdatePumpWater event', async () => {
    render(
      <SocketProvider url="http://localhost">
        <TestComponent />
      </SocketProvider>
    );

    act(() => {
      mockSocketOn.mock.calls.find(call => call[0] === 'shadowUpdatePumpWater')?.[1]({ data: 'pump' });
    });

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Refresh Shadow')).toBeInTheDocument();
  });

  /**
   * Tests handling of the shadowUpdateAuto event.
   */
  test('handles shadowUpdateAuto event', async () => {
    render(
      <SocketProvider url="http://localhost">
        <TestComponent />
      </SocketProvider>
    );

    act(() => {
      mockSocketOn.mock.calls.find(call => call[0] === 'shadowUpdateAuto')?.[1]({ data: 'auto' });
    });

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Refresh Shadow')).toBeInTheDocument();
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
