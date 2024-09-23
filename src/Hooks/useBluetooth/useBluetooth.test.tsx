import React, {act, useState} from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import useBluetooth from './useBluetooth';

//mocking the useBluetooth
jest.mock('./useBluetooth', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        connectBluetooth: jest.fn(),
        sendCredentials: jest.fn(),
        bleDevice: null,
        onDisconnected: jest.fn(),
        triggerDisconnection: jest.fn(),
        bleStatus: null,
    })),
}));


/**
 * Test component that uses the `useBluetooth` hook to handle Bluetooth connection, disconnection, and sending credentials.
 * 
 * @param {Object} props - Component props.
 * @param {string} props.cat_num - The Bluetooth device name to connect.
 * @param {string} [props.wifi_ssid] - Optional WiFi SSID to send to the Bluetooth device.
 * @param {string} [props.wifi_password] - Optional WiFi password to send to the Bluetooth device.
 * @returns {JSX.Element} - The rendered component.
 */
const TestBluetoothComponent = ({ cat_num, wifi_ssid, wifi_password }: { cat_num: string, wifi_ssid?: string, wifi_password?: string }): JSX.Element => {
    const { connectBluetooth, sendCredentials, bleStatus, onDisconnected } = useBluetooth();
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle the Bluetooth connection process by calling the `connectBluetooth` function from `useBluetooth` hook.
     * Sets an error message if the connection fails.
     * 
     * @function
     */
    const handleConnectBluetooth = async () => {
        try {
            await connectBluetooth(cat_num);
        } catch (err: any) {
            setError(err.message);
        }
    };

    /**
     * Handle sending WiFi credentials (SSID and password) to the connected Bluetooth device.
     * Sets an error message if sending credentials fails.
     * 
     * @function
     */
    const handleSendCredentials = async () => {
        try {
            await sendCredentials(wifi_ssid!, wifi_password!);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
    <div>
        <button onClick={handleConnectBluetooth}>Connect Bluetooth</button>
        <button onClick={onDisconnected}>Simulate Disconnection</button>
        {wifi_ssid && wifi_password && (
        <button onClick={handleSendCredentials}>Send Credentials</button>
        )}
        <h4 data-testid="bleStatus">{bleStatus}</h4>
        {error && <p data-testid="error">{error}</p>}
    </div>
    );
};

/**
 * Tests for the useBluetooth hook.
 */
describe('useBluetooth hook', () => {
    const mockConnectBluetooth = jest.fn();
    const mockSendCredentials = jest.fn();
    const mockOnDisconnected = jest.fn();
    const mockTriggerDisconnection = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test to verify that the `connectBluetooth` function is called with the correct arguments.
     */
    it('calls connectBluetooth', async () => {
        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: mockSendCredentials,
            bleDevice: null,
            onDisconnected: mockOnDisconnected,
            triggerDisconnection: mockTriggerDisconnection,
            bleStatus: null,
        });

        render(<TestBluetoothComponent cat_num="CAT123" />);

        const connectButton = screen.getByText('Connect Bluetooth');
        fireEvent.click(connectButton);

        await waitFor(() => {
            expect(mockConnectBluetooth).toHaveBeenCalledWith('CAT123');
        });
    });

    /**
     * Test to verify that the `onDisconnected` function is called when simulating a disconnection.
     */
    it('calls onDisconnected', async () => {
        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: mockSendCredentials,
            bleDevice: null,
            onDisconnected: mockOnDisconnected,
            triggerDisconnection: mockTriggerDisconnection,
            bleStatus: null,
        });

        render(<TestBluetoothComponent cat_num="CAT123" />);

        const connectButton = screen.getByText('Connect Bluetooth');
        fireEvent.click(connectButton);

        await waitFor(() => {
            expect(mockConnectBluetooth).toHaveBeenCalledWith('CAT123');
        });

        const simulateDisconnectionButton = screen.getByText('Simulate Disconnection');
        fireEvent.click(simulateDisconnectionButton);

        await waitFor(() => {
            expect(mockOnDisconnected).toHaveBeenCalled();
        });

    }); 

    /**
     * Test to verify that WiFi credentials are successfully sent via the `sendCredentials` function.
     */
    it('should send WiFi credentials successfully', async () => {
        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: mockSendCredentials,
            bleDevice: null,
            onDisconnected: mockOnDisconnected,
            triggerDisconnection: mockTriggerDisconnection,
            bleStatus: null,
        });

        render(<TestBluetoothComponent cat_num="CAT123" wifi_ssid='TestSSID' wifi_password='password123' />);

        const connectButton = screen.getByText('Connect Bluetooth');
        fireEvent.click(connectButton);

        await waitFor(() => {
            expect(mockConnectBluetooth).toHaveBeenCalledWith('CAT123');
        });

        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: mockSendCredentials,
            bleDevice: { cat_num: 'CAT123' },
            onDisconnected: mockOnDisconnected,
            triggerDisconnection: mockTriggerDisconnection,
            bleStatus: null,
        });

        const sendCredentialsButton = screen.getByText('Send Credentials');
        fireEvent.click(sendCredentialsButton);

        await waitFor(() => {
            expect(mockSendCredentials).toHaveBeenCalledWith('TestSSID', 'password123');
        });
    });

    /**
     * Test to verify that an error message is displayed when Bluetooth connection fails.
     */
    it('should handle connection failure', async () => {
        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: jest.fn().mockRejectedValue(new Error('Connection failed')),
            sendCredentials: mockSendCredentials,
            bleDevice: null,
            onDisconnected: mockOnDisconnected,
            triggerDisconnection: mockTriggerDisconnection,
            bleStatus: 'Not connected',
        });

        render(<TestBluetoothComponent cat_num="CAT123" />);

        const connectButton = screen.getByText('Connect Bluetooth');
        fireEvent.click(connectButton);
        
        await waitFor(() => {
            expect(screen.getByTestId('bleStatus')).toHaveTextContent('Not connected');
        });

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Connection failed');
        });
    });
    
    /**
     * Test to verify that an error message is displayed when sending WiFi credentials fails.
     */
    it('should handle errors during WiFi credentials sending', async () => {
        (useBluetooth as jest.Mock).mockReturnValue({
            connectBluetooth: mockConnectBluetooth,
            sendCredentials: jest.fn().mockRejectedValue(new Error('Failed to send credentials')),
            bleDevice: { cat_num: 'CAT123' },
            onDisconnected: mockOnDisconnected,
            triggerDisconnection: mockTriggerDisconnection,
            bleStatus: 'Connected',
        });
        
        render(<TestBluetoothComponent cat_num="CAT123" wifi_ssid='TestSSID' wifi_password='password123' />);

        const connectButton = screen.getByText('Connect Bluetooth');
        fireEvent.click(connectButton);

        await waitFor(() => {
            expect(mockConnectBluetooth).toHaveBeenCalledWith('CAT123');
        });

        const sendCredentialsButton = screen.getByText('Send Credentials');
        act(() => {
            fireEvent.click(sendCredentialsButton);
        });
        
        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent('Failed to send credentials');
        });
    });
});