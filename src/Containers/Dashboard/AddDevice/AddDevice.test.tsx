import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import AddDevice from './AddDevice';
import { useAuth } from '../../../Provider/AuthProvider';
import { useDevice } from '../../../Provider/DeviceProvider';
import useBluetooth from '../../../Hooks/useBluetooth';
import { useSettingsHandlers } from '../../../Hooks/useSettingsHandlers';

jest.mock('../../../Provider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        setAccessToken: jest.fn(),
        accessToken: null,
    })),
}));

jest.mock('../../../Provider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        setDevice: jest.fn(),
    })),
}));

jest.mock('../../../Hooks/useBluetooth', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        connectBluetooth: jest.fn(),
        sendCredentials: jest.fn(),
        bleDevice: null,
    })),
}));

jest.mock('../../../Hooks/useSettingsHandlers', () => ({
    useSettingsHandlers: jest.fn(() => ({
        handleAddDevice: jest.fn(),
        error: null, 
        resetError: jest.fn(),
    })),
}));

describe('AddDevice component', () => {
    const mockSetConnectDeviceToggle = jest.fn();
    const mockShowPerformanceView = jest.fn();
    const mockConnectBluetooth = jest.fn();
    const mockSendCredentials = jest.fn();
    const mockSetDevice = jest.fn();
    const mockResetError = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls connectBluetooth when the form is submitted', async () => {
        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: jest.fn(),
            bleDevice: null,
        });

        (useSettingsHandlers as jest.Mock).mockReturnValue({
            handleAddDevice: jest.fn(),
            resetError: jest.fn(),
            error: null,
        });

        render(<AddDevice setConnectDeviceToggle={mockSetConnectDeviceToggle} showPerformanceView={mockShowPerformanceView} />);
        
        fireEvent.change(screen.getByPlaceholderText('Location'), {
            target: { value: 'Kitchen' }
        });

        fireEvent.change(screen.getByPlaceholderText('Asset Number'), {
            target: { value: '123456' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi SSID'), {
            target: { value: 'TestSSID' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi Password'), {
            target: { value: 'password123' }
        });

        fireEvent.submit(screen.getByTestId('add-form'));

        await waitFor(() => {
            expect(mockConnectBluetooth).toHaveBeenCalledWith('123456');
        });
    });

    it('calls handleNewConnection when bleDevice is set', async () => {
        const mockHandleAddDevice = jest.fn((token, setToken, deviceData, callback) => {
            callback({ data: { device: { device_id: 1 } } });
        });

        (useAuth as jest.Mock).mockReturnValue({
            accessToken: 'token123',
            setAccessToken: jest.fn(),
        });

        (useDevice as jest.Mock).mockReturnValue({
            setDevice: mockSetDevice,
        });

        (useSettingsHandlers as jest.Mock).mockReturnValue({
            handleAddDevice: mockHandleAddDevice,
            resetError: jest.fn(),
            error: null,
        });

        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: mockSendCredentials,
            bleDevice: null,
        });

        const { rerender } = render(
            <AddDevice setConnectDeviceToggle={mockSetConnectDeviceToggle} showPerformanceView={mockShowPerformanceView} />
        );

        fireEvent.change(screen.getByPlaceholderText('Location'), {
            target: { value: 'Kitchen' }
        });

        fireEvent.change(screen.getByPlaceholderText('Asset Number'), {
            target: { value: '123456' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi SSID'), {
            target: { value: 'TestSSID' }
        });

        fireEvent.change(screen.getByPlaceholderText('Wifi Password'), {
            target: { value: 'password123' }
        });

        fireEvent.submit(screen.getByTestId('add-form'));

        await waitFor(() => {
            expect(mockConnectBluetooth).toHaveBeenCalledWith('123456');
        });

        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: mockSendCredentials,
            bleDevice: { cat_num: '123456' },
        });

        rerender(
            <AddDevice setConnectDeviceToggle={mockSetConnectDeviceToggle} showPerformanceView={mockShowPerformanceView} />
        );

        await waitFor(() => {
            expect(mockHandleAddDevice).toHaveBeenCalledWith('token123', expect.any(Function), {
                location: 'Kitchen',
                cat_num: '123456',
                wifi_ssid: 'TestSSID',
                wifi_password: 'password123'
            }, expect.any(Function));
        });

        await waitFor(() => {
            expect(mockSendCredentials).toHaveBeenCalledWith('TestSSID', 'password123');
            expect(mockSetDevice).toHaveBeenCalledWith({ device_id: 1 });
        });

        expect(mockSetConnectDeviceToggle).toHaveBeenCalledWith(true);
        expect(mockShowPerformanceView).toHaveBeenCalled();
    });

    it('resets error on component mount', () => {
        (useSettingsHandlers as jest.Mock).mockReturnValue({
            handleAddDevice: jest.fn(),
            resetError: mockResetError,
            error: null,
        });

        render(<AddDevice setConnectDeviceToggle={mockSetConnectDeviceToggle} showPerformanceView={mockShowPerformanceView} />);

        expect(mockResetError).toHaveBeenCalled();
    });
});
