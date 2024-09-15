import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import { useAuth } from '../../Provider/AuthProvider';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useSocket } from '../../Provider/SocketProvider';
import { useDeviceData } from '../../Hooks/useDeviceData';

jest.mock('./PerformanceView/PerformanceView', () => (props: any) => (
    <div>
        Performance View
        <button onClick={props.setConnectDeviceToggle}>Connect Device</button>
        <button onClick={props.handleRefreshClick}>Refresh</button>
        <button onClick={props.setAutoSwitch}>Set Auto Switch</button>
        <button onClick={props.setConfirmAuto}>Set Confirm Auto</button>
    </div>
));
jest.mock('./Account/Account', () => () => <div>Account View</div>);
jest.mock('./AddDevice/AddDevice', () => (props: any) => (
    <div>
        Add Device View
        <button onClick={props.setConnectDeviceToggle}>Connect Device</button>
        <button onClick={props.showPerformanceView}>Show Performance</button>
    </div>
));
jest.mock('../../Modals/AddDeviceModal', () => (props: any) => (
    <div>
        Add Device Modal
        <button onClick={props.setConnectDeviceToggle}>Connect Device</button>
    </div>
));
jest.mock('../../Modals/ConfirmActionModal', () => (props: any) => (
    <div>
        Confirm Action Modal
        <button onClick={props.setAutoSwitch}>Set Auto Switch</button>
        <button onClick={props.setConfirmAuto}>Set Confirm Auto</button>
    </div>
));
jest.mock('./DashboardHeader/DashboardHeader', () => (props: any) => (
    <div>
        Dashboard Header
        <button onClick={props.handlePlantPalClick}>PlantPal</button>
        <button onClick={props.handleRefreshClick}>Refresh</button>
        <button onClick={props.handleLogout}>Logout</button>
        <button onClick={props.showAccountView}>Show Account</button>
    </div>
));
jest.mock('./DeviceMenu/DeviceMenu', () => (props: any) => (
    <div>
        Device Menu
        <button onClick={props.showAddDeviceView}>Show Add Device</button>
        <button onClick={props.showPerformanceView}>Show Performance</button>
    </div>
));
jest.mock('../../Components/LoadingDots/LoadingDots', () => () => <div>Loading Dots</div>);

jest.mock('../../Provider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        clearAccessToken: jest.fn(),
        accessToken: null,
        user: null,
        clearUser: jest.fn(),
    })),
}));
jest.mock('../../Provider/SocketProvider', () => ({
    useSocket: jest.fn(() => ({
        connectSocket: jest.fn(),
        isConnected: false,
        sendRemoveUser: jest.fn(),
        sendCheckSocket: jest.fn(),
        refresh: false,
        setRefresh: jest.fn(),
        errorReconnect: false,
        setErrorReconnect: jest.fn(),
    })),
}));
jest.mock('../../Hooks/useDeviceData', () => ({
    useDeviceData: jest.fn(() => ({
        fetchUserDevices: jest.fn(),
        isDevicesLoading: false, 
        isDevicesLoaded: false,
    })),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Dashboard Component', () => {
  const mockClearAccessToken = jest.fn();
  const mockClearUser = jest.fn();
  const mockSendRemoveUser = jest.fn();
  const mockSendCheckSocket = jest.fn();
  const mockFetchUserDevices = jest.fn();

  const deviceDataMock = {
    fetchUserDevices: mockFetchUserDevices,
    isDevicesLoading: false,
    isDevicesLoaded: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAuth as jest.Mock).mockReturnValue({
        accessToken: 'token123',
        user: { user_id: 1 },
        clearAccessToken: mockClearAccessToken,
        clearUser: mockClearUser,
    });

    (useSocket as jest.Mock).mockReturnValue({
        isConnected: true,
        sendRemoveUser: mockSendRemoveUser,
        sendCheckSocket: mockSendCheckSocket,
        refresh: false,
        setRefresh: jest.fn(),
        errorReconnect: false,
        setErrorReconnect: jest.fn(),
    });

    (useDeviceData as jest.Mock).mockReturnValue({
        fetchUserDevices: mockFetchUserDevices,
        isDevicesLoading: false,
        isDevicesLoaded: true,
    });

  });

  test('renders Dashboard with Performance View as the default view', () => {
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Header')).toBeInTheDocument();
    expect(screen.getByText('Device Menu')).toBeInTheDocument();
    expect(screen.getByText('Performance View')).toBeInTheDocument();
  });

  test('renders Account View when the state changes to accountView', () => {
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </MemoryRouter>
    );

    const accountButton = screen.getByText('Show Account');
    fireEvent.click(accountButton);

    waitFor(() => {
      expect(screen.getByText('Account View')).toBeInTheDocument();
    });
  });
  
  test('calls fetchUserDevices on component mount when connected', async () => {
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockFetchUserDevices).toHaveBeenCalled();
    });
  });

  test('logs out the user and clears tokens if errorReconnect is true', async () => {
    (useSocket as jest.Mock).mockReturnValue({
        isConnected: true,
        sendRemoveUser: mockSendRemoveUser,
        sendCheckSocket: mockSendCheckSocket,
        refresh: false,
        setRefresh: jest.fn(),
        errorReconnect: true,
        setErrorReconnect: jest.fn(),
    });

    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auth" element={<div>Authentication</div>} />
            </Routes>
        </MemoryRouter>
    );

    expect(mockClearAccessToken).toHaveBeenCalled();
    expect(mockClearUser).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth', { replace: true });
  });
  
  test('shows loading dots when devices are loading', () => {
    (useDeviceData as jest.Mock).mockReturnValue({
        fetchUserDevices: mockFetchUserDevices,
        isDevicesLoading: true,
        isDevicesLoaded: false,
    });

    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </MemoryRouter>
    );

    expect(screen.getByText('Loading Dots')).toBeInTheDocument();
  });

  test('renders Add Device Modal when connectDeviceToggle is true', () => {
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Show Add Device'));
    fireEvent.click(screen.getByText('Connect Device'));

    expect(screen.getByText('Add Device Modal')).toBeInTheDocument();
  });
  
  test('handles logout correctly', () => {
    render(
        <MemoryRouter initialEntries={['/dashboard']}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auth" element={<div>Authentication</div>} />
            </Routes>
        </MemoryRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockSendRemoveUser).toHaveBeenCalledWith(1);
    expect(mockClearUser).toHaveBeenCalled();
    expect(mockClearAccessToken).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/auth', { "replace": true });
  });
  
});
