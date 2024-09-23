import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AutoManualWater from './AutoManualWater';
import { useSocket } from '../../../../Provider/SocketProvider/SocketProvider';
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';
import { useAuth } from '../../../../Provider/AuthProvider/AuthProvider';
import { useSettingsHandlers } from '../../../../Hooks/useSettingsHandlers';

// Mocking the mui BarChart
jest.mock('@mui/x-charts/BarChart', () => ({
    BarChart: jest.fn(() => <div data-testid="mock-bar-chart"></div>),
}));

// Mocking the SocketProvider
jest.mock('../../../../Provider/SocketProvider/SocketProvider', () => ({
    useSocket: jest.fn(() => ({
        setRefresh: jest.fn(),
    })),
}));

// Mocking the DeviceProvider
jest.mock('../../../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        devices: null,
        lastLog: null,
        device: null,
        deviceLogs: null,
    })),
}));

// Mocking the AuthProvider
jest.mock('../../../../Provider/AuthProvider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        setAccessToken: jest.fn(),
        accessToken: null,
    })),
}));

// Mocking the useSettingsHandlers
jest.mock('../../../../Hooks/useSettingsHandlers', () => ({
    useSettingsHandlers: jest.fn(() => ({
        handleUpdatePumpWater: jest.fn(),
    })),
}));

/**
 * Test suite for the AutoManualWater component.
 */
describe('AutoManualWater Component', () => {
    const mockSetAutoSwitch = jest.fn();
    const mockSetConfirmAuto = jest.fn();
    const mockSetRefresh = jest.fn();
    const mockHandleUpdatePumpWater = jest.fn();
    const mockSetAccessToken = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useAuth as jest.Mock).mockReturnValue({
            setAccessToken: mockSetAccessToken,
            accessToken: "token123",
        });

        (useSocket as jest.Mock).mockReturnValue({
            setRefresh: mockSetRefresh,
        });

        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1, presence_connection: true }],
            lastLog: {},
            device: { device_id: 1, presence_connection: true },
            deviceLogs: [],
            deviceShadow: {
                state: {
                    desired: { pump: false },
                    reported: { pump: false },
                },
            },
        });

        (useSettingsHandlers as jest.Mock).mockReturnValue({
            handleUpdatePumpWater: mockHandleUpdatePumpWater,
        });

    });

    /**
     * Test to verify that the auto-triangle image is rendered when lastLog is not available.
     */
    test('renders auto-triangle image when lastLog is not available', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [],
            lastLog: null,
            device: null,
            deviceLogs: [],
        });

        render(
            <AutoManualWater
                autoSwitch={false}
                setAutoSwitch={mockSetAutoSwitch}
                setConfirmAuto={mockSetConfirmAuto}
            />
        );

        const autoTriangleImage = screen.getByAltText('Auto Error icon');
        expect(autoTriangleImage).toBeInTheDocument();
    });
    
    /**
     * Test to ensure that handleUpdatePumpWaterClick is called when the Manual button is clicked.
     */
    test('calls handleUpdatePumpWaterClick when Manual button is clicked', () => {
        render(
            <AutoManualWater
                autoSwitch={false}
                setAutoSwitch={mockSetAutoSwitch}
                setConfirmAuto={mockSetConfirmAuto}
            />
        );

        expect(screen.queryByText('Manual')).toBeInTheDocument();
        fireEvent.click(screen.getByAltText('Tap Icon'));

        expect(mockHandleUpdatePumpWater).toHaveBeenCalled();
    });

    /**
     * Test to verify that the Auto component is displayed when autoSwitch is true.
     */
    test('shows Auto component when autoSwitch is true', () => {
        render(
            <AutoManualWater
                autoSwitch={true}
                setAutoSwitch={mockSetAutoSwitch}
                setConfirmAuto={mockSetConfirmAuto}
            />
        );

        expect(screen.getByText('Auto')).toBeInTheDocument();
        expect(screen.queryByText('Manual')).toBeNull();
    });
});
