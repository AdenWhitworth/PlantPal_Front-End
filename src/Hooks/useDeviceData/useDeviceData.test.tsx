import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { getUserDevices, getDeviceLogs, getDeviceShadow } from '../../Services/ApiService/ApiService';
import { useAuth } from '../../Provider/AuthProvider/AuthProvider';
import { useDevice } from '../../Provider/DeviceProvider/DeviceProvider';
import { useDeviceData } from './useDeviceData';

//mocking the ApiService
jest.mock('../../Services/ApiService/ApiService', () => ({
    getUserDevices: jest.fn(),
    getDeviceLogs: jest.fn(),
    getDeviceShadow: jest.fn(),
}));

//mocking the AuthProvider
jest.mock('../../Provider/AuthProvider/AuthProvider', () => ({
    useAuth: jest.fn(),
}));

//mocking the DeviceProvider
jest.mock('../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(),
}));


/**
 * Test component that uses the `useDeviceData` hook.
 * 
 * @component TestComponent
 * @param {Object} props - Component properties.
 * @param {Function} props.handleLogout - Function to handle user logout.
 * @returns {JSX.Element} Rendered TestComponent.
 */
const TestComponent= ({handleLogout}:{handleLogout: () => void}): JSX.Element => {
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

/**
 * Tests for the useDeviceData hook.
 */
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

    /**
     * Test case for handling successful fetching of user devices.
     */
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

    /**
     * Test case for handling error during fetching of user devices.
     */
    it('should handle fetchUserDevices error', async () => {
        (getUserDevices as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<TestComponent handleLogout={mockHandleLogout}/>);

        fireEvent.click(screen.getByText('Fetch Devices'));

        await waitFor(() => {
            expect(mockHandleLogout).toHaveBeenCalled();
        });
    });

    /**
     * Test case for handling successful fetching of user device details.
     */
    it('should handle fetchUserDevice', async () => {
        (getDeviceLogs as jest.Mock).mockResolvedValue({ data: { deviceLogs: [], lastLog: null } });
        (getDeviceShadow as jest.Mock).mockResolvedValue({ data: { deviceShadow: {} } });

        render(<TestComponent handleLogout={mockHandleLogout}/>);

        await waitFor(() => {
            expect(screen.getByTestId('device-loading')).toHaveTextContent('Device Loaded');
        });
    });

    /**
     * Test case for handling error during fetching of user device details.
     */
    it('should handle fetchUserDevice error', async () => {
        (getDeviceLogs as jest.Mock).mockRejectedValue(new Error('Network error'));
        (getDeviceShadow as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<TestComponent handleLogout={mockHandleLogout}/>);

        await waitFor(() => {
            expect(mockHandleLogout).toHaveBeenCalled();
        });
    });
});
