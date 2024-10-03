import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WifiConnection from './WifiConnection';
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';
import useBluetooth from '../../../../Hooks/useBluetooth/useBluetooth';
import { useAuth } from '../../../../Provider/AuthProvider/AuthProvider';
import { useSettingsHandlers } from '../../../../Hooks/useSettingsHandlers/useSettingsHandlers';

//Mocking the DeviceProvider
jest.mock('../../../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        devices: null,
        device: null,
    })),
}));

//Mocking the useBluetooth
jest.mock('../../../../Hooks/useBluetooth/useBluetooth', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        connectBluetooth: jest.fn(),
        sendCredentials: jest.fn(),
        bleDevice: null,
    })),
}));

//Mocking the AuthProvider
jest.mock('../../../../Provider/AuthProvider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        setAccessToken: jest.fn(),
        accessToken: null,
    })),
}));

//Mocking the useSettingsHandlers
jest.mock('../../../../Hooks/useSettingsHandlers/useSettingsHandlers', () => ({
    useSettingsHandlers: jest.fn(() => ({
        handleUpdateWifi: jest.fn(),
        error: null, 
        resetError: jest.fn(),
        setError: jest.fn(),
    })),
}));

/**
 * Test suite for WifiConnection component
 */
describe('WifiConnection', () => {
    const mockConnectBluetooth = jest.fn();
    const mockSendCredentials = jest.fn();
    const mockResetError = jest.fn();
    const mockSetError = jest.fn();
    const mockHandleRefreshClick = jest.fn();
    const mockSetConnectDeviceToggle = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test to verify that the component is hidden when there are no devices.
     */
    test('does not render when there are no devices', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [],
            device: null,
        });

        render(<WifiConnection setConnectDeviceToggle={jest.fn()} handleRefreshClick={jest.fn()} />);

        const connectionElement = screen.getByTestId("dashboard-connection");
        expect(connectionElement).toHaveClass('hidden');
    });

    /**
     * Test to verify that the EditWifiForm is rendered when change wifi button is clicked
     */
    test('renders and shows EditWifiForm when device is present', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            device: { presence_connection: false, wifi_ssid: 'test_ssid' },
        });

        render(<WifiConnection setConnectDeviceToggle={jest.fn()} handleRefreshClick={jest.fn()} />);
        
        fireEvent.click(screen.getByText('Change Wifi?'));
        expect(screen.getByTestId('wifi-form')).toBeInTheDocument();
    });

    /**
     * Test to verify that connection details are displayed when a device is present and connection is available.
     */
    test('renders connection details when device is present', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            device: { presence_connection: true, wifi_ssid: 'test_ssid' },
        });

        render(<WifiConnection setConnectDeviceToggle={jest.fn()} handleRefreshClick={jest.fn()} />);
        
        expect(screen.getByText('Connected')).toBeInTheDocument();
        expect(screen.getByText('SSID: test_ssid')).toBeInTheDocument();
    });

    /**
     * Test to verify that edit wifi form can be closed.
     */
    test('renders wifi details when edit wifi form is closed', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            device: { presence_connection: true, wifi_ssid: 'test_ssid' },
        });
        
        render(<WifiConnection setConnectDeviceToggle={jest.fn()} handleRefreshClick={jest.fn()} />);
        
        expect(screen.getByText('Connected')).toBeInTheDocument();
        expect(screen.getByText('SSID: test_ssid')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Change Wifi?'));

        expect(screen.getByText('Connection')).toBeInTheDocument();
        
        const closeBtn = screen.getByAltText("Close Icon");
        expect(closeBtn).toBeInTheDocument();
        fireEvent.click(closeBtn);

        expect(screen.getByText('Connected')).toBeInTh
    });

    /**
     * Test to verify that the connectBluetooth function is called with the correct device.cat_num when the connect button is clicked.
     */
    test('calls connectBluetooth with correct device.cat_num on connect button click', async () => {
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

        fireEvent.change(screen.getByPlaceholderText('Wifi SSID'), {
            target: { value: 'NewSSID' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi Password'), {
            target: { value: 'NewPassword' }
        });

        fireEvent.submit(screen.getByTestId('wifi-form'));

        await waitFor(() => {
            expect(mockConnectBluetooth).toHaveBeenCalledWith('cat123');
        });
    });
    
    /**
     * Test to verify that form submission correctly handles updating WiFi credentials and calling the necessary functions.
     */
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
            setError: mockSetError,
        });
        

        render(<WifiConnection setConnectDeviceToggle={mockSetConnectDeviceToggle} handleRefreshClick={mockHandleRefreshClick} />);

        fireEvent.click(screen.getByText('Change Wifi?'));

        fireEvent.change(screen.getByPlaceholderText('Wifi SSID'), {
            target: { value: 'NewSSID' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi Password'), {
            target: { value: 'NewPassword' }
        });

        fireEvent.submit(screen.getByTestId('wifi-form'));

        expect(screen.getByText("Connecting...")).toBeInTheDocument();
        
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
            expect(mockSetConnectDeviceToggle).toHaveBeenCalledWith(true);
        });
    });
});
