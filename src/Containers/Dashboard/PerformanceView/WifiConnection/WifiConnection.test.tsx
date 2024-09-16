import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WifiConnection from './WifiConnection';
import { useDevice } from '../../../../Provider/DeviceProvider';
import useBluetooth from '../../../../Hooks/useBluetooth';
import { useAuth } from '../../../../Provider/AuthProvider';
import { useSettingsHandlers } from '../../../../Hooks/useSettingsHandlers';

jest.mock('../../../../Provider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        devices: null,
        device: null,
    })),
}));

jest.mock('../../../../Hooks/useBluetooth', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        connectBluetooth: jest.fn(),
        sendCredentials: jest.fn(),
        bleDevice: null,
    })),
}));

jest.mock('../../../../Provider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        setAccessToken: jest.fn(),
        accessToken: null,
    })),
}));

jest.mock('../../../../Hooks/useSettingsHandlers', () => ({
    useSettingsHandlers: jest.fn(() => ({
        handleUpdateWifi: jest.fn(),
        error: null, 
        resetError: jest.fn(),
    })),
}));

describe('WifiConnection', () => {
    const mockConnectBluetooth = jest.fn();
    const mockSendCredentials = jest.fn();
    const mockResetError = jest.fn();
    const mockHandleRefreshClick = jest.fn();
    const mockSetConnectDeviceToggle = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('does not render when there are no devices', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [],
            device: null,
        });

        render(<WifiConnection setConnectDeviceToggle={jest.fn()} handleRefreshClick={jest.fn()} />);

        const connectionElement = screen.getByTestId("dashboard-connection");
        expect(connectionElement).toHaveClass('hidden');
    });

    test('renders and shows EditWifiForm when bleDevice is present', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            device: { presence_connection: false, wifi_ssid: 'test_ssid' },
        });

        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: jest.fn(),
            sendCredentials: jest.fn(),
            bleDevice: { cat_num: '12345' },
        });

        render(<WifiConnection setConnectDeviceToggle={jest.fn()} handleRefreshClick={jest.fn()} />);

        expect(screen.getByTestId('wifi-form')).toBeInTheDocument();
    });

    test('renders connection details when device is present and bleDevice is not', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            device: { presence_connection: true, wifi_ssid: 'test_ssid' },
        });

        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: jest.fn(),
            sendCredentials: jest.fn(),
            bleDevice: null,
        });

        render(<WifiConnection setConnectDeviceToggle={jest.fn()} handleRefreshClick={jest.fn()} />);

        expect(screen.getByText('Connected')).toBeInTheDocument();
        expect(screen.getByText('SSID: test_ssid')).toBeInTheDocument();
    });

    test('calls connectBluetooth with correct device.cat_num on button click', async () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            device: { presence_connection: false, wifi_ssid: 'test_ssid', cat_num: 'cat123' },
        });

        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: jest.fn(),
            bleDevice: null,
        });

        render(<WifiConnection setConnectDeviceToggle={jest.fn()} handleRefreshClick={jest.fn()} />);

        fireEvent.click(screen.getByText('Change Wifi?'));

        await waitFor(() => {
            expect(mockConnectBluetooth).toHaveBeenCalledWith('cat123');
        });
    });
    
    test('handles form submission correctly', async () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            device: { device_id: 1, presence_connection: false, wifi_ssid: 'test_ssid', cat_num: 'cat123' },
        });

        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: jest.fn(),
            sendCredentials: mockSendCredentials,
            bleDevice: { cat_num: '12345' },
        });

        (useAuth as jest.Mock).mockReturnValue({
            accessToken: 'token123',
            setAccessToken: jest.fn(),
        });

        const mockHandleUpdateWifi = jest.fn((token, setToken, deviceData, callback) => {
            callback();
        });

        (useSettingsHandlers as jest.Mock).mockReturnValue({
            handleUpdateWifi: mockHandleUpdateWifi,
            error: null,
            resetError: mockResetError,
        });
        

        render(<WifiConnection setConnectDeviceToggle={mockSetConnectDeviceToggle} handleRefreshClick={mockHandleRefreshClick} />);

        fireEvent.change(screen.getByPlaceholderText('Wifi SSID'), {
            target: { value: 'NewSSID' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi Password'), {
            target: { value: 'NewPassword' }
        });

        fireEvent.submit(screen.getByTestId('wifi-form'));

        await waitFor(() => {
            expect(mockHandleUpdateWifi).toHaveBeenCalledWith('token123', expect.any(Function), {
                device_id: 1,
                wifi_ssid: 'NewSSID',
                wifi_password: 'NewPassword'
            }, expect.any(Function));
        });
    
        await waitFor(() => {
            expect(mockSendCredentials).toHaveBeenCalledWith('NewSSID', 'NewPassword');
            expect(mockResetError).toHaveBeenCalled();
            expect(mockHandleRefreshClick).toHaveBeenCalled();
            expect(mockSetConnectDeviceToggle).toHaveBeenCalledWith(true);
        });
    });
});
