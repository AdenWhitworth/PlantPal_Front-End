import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AutoManualWater from './AutoManualWater';
import { useSocket } from '../../../../Provider/SocketProvider';
import { useDevice } from '../../../../Provider/DeviceProvider';
import { useAuth } from '../../../../Provider/AuthProvider';
import { useSettingsHandlers } from '../../../../Hooks/useSettingsHandlers';

jest.mock('@mui/x-charts/BarChart', () => ({
    BarChart: jest.fn(() => <div data-testid="mock-bar-chart"></div>),
}));

jest.mock('../../../../Provider/SocketProvider', () => ({
    useSocket: jest.fn(() => ({
        setRefresh: jest.fn(),
    })),
}));

jest.mock('../../../../Provider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        devices: null,
        lastLog: null,
        device: null,
        deviceLogs: null,
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
        handleUpdatePumpWater: jest.fn(),
    })),
}));

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
