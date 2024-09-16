import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { getUserDevices, getDeviceLogs, getDeviceShadow } from '../Services/ApiService';
import { useAuth } from '../Provider/AuthProvider';
import { useDevice } from '../Provider/DeviceProvider';
import { useDeviceData } from './useDeviceData';

jest.mock('../Services/ApiService', () => ({
    getUserDevices: jest.fn(),
    getDeviceLogs: jest.fn(),
    getDeviceShadow: jest.fn(),
}));

jest.mock('../Provider/AuthProvider', () => ({
    useAuth: jest.fn(),
}));

jest.mock('../Provider/DeviceProvider', () => ({
    useDevice: jest.fn(),
}));

const TestComponent= ({handleLogout}:{handleLogout: () => void}) => {
    const {
        fetchUserDevices,
        isDevicesLoading,
        isDeviceLoading,
        isDevicesLoaded
    } = useDeviceData({ handleLogout });

    return (
        <div>
            <button onClick={fetchUserDevices}>Fetch Devices</button>
            <div data-testid="devices-loading">{isDevicesLoading ? 'Loading Devices...' : 'Devices Loaded'}</div>
            <div data-testid="device-loading">{isDeviceLoading ? 'Loading Device...' : 'Device Loaded'}</div>
            <div data-testid="devices-loaded">{isDevicesLoaded ? 'Devices Loaded' : 'Devices Not Loaded'}</div>
        </div>
    );
};

describe('useDeviceData', () => {
    const mockSetAccessToken = jest.fn();
    const mockSetDevices = jest.fn();
    const mockSetDeviceShadow = jest.fn();
    const mockSetDeviceLogs = jest.fn();
    const mockSetLastLog = jest.fn();
    const mockSetRefreshDate = jest.fn();
    const mockHandleLogout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
       
        (useAuth as jest.Mock).mockReturnValue({
            accessToken: 'test-token',
            setAccessToken: mockSetAccessToken,
        });

        (useDevice as jest.Mock).mockReturnValue({
            setDevices: mockSetDevices,
            setDeviceShadow: mockSetDeviceShadow,
            setDeviceLogs: mockSetDeviceLogs,
            setLastLog: mockSetLastLog,
            setRefreshDate: mockSetRefreshDate,
            device: { cat_num: '123', thing_name: 'test-thing' },
            lastLog: { log_date: new Date().toISOString() },
        });
    });

    it('should handle fetchUserDevices', async () => {
        (getUserDevices as jest.Mock).mockResolvedValue({ data: { devices: [] } });

        render(<TestComponent handleLogout={mockHandleLogout}/>);

        fireEvent.click(screen.getByText('Fetch Devices'));

        await waitFor(() => {
            expect(screen.getByTestId('devices-loading')).toHaveTextContent('Loading Devices...');
        });

        await waitFor(() => {
            expect(screen.getByTestId('devices-loaded')).toHaveTextContent('Devices Loaded');
        });
    });

    it('should handle fetchUserDevices error', async () => {
        (getUserDevices as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<TestComponent handleLogout={mockHandleLogout}/>);

        fireEvent.click(screen.getByText('Fetch Devices'));

        await waitFor(() => {
            expect(mockHandleLogout).toHaveBeenCalled();
        });
    });

    it('should handle fetchUserDevice', async () => {
        (getDeviceLogs as jest.Mock).mockResolvedValue({ data: { deviceLogs: [], lastLog: null } });
        (getDeviceShadow as jest.Mock).mockResolvedValue({ data: { deviceShadow: {} } });

        render(<TestComponent handleLogout={mockHandleLogout}/>);

        await waitFor(() => {
            expect(screen.getByTestId('device-loading')).toHaveTextContent('Device Loaded');
        });
    });

    it('should handle fetchUserDevice error', async () => {
        (getDeviceLogs as jest.Mock).mockRejectedValue(new Error('Network error'));
        (getDeviceShadow as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<TestComponent handleLogout={mockHandleLogout}/>);

        await waitFor(() => {
            expect(mockHandleLogout).toHaveBeenCalled();
        });
    });
});
