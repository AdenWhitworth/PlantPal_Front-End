import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Manual from './Manual';
import { useDevice } from '../../../../../Provider/DeviceProvider/DeviceProvider';

//Mocking the DeviceProvider
jest.mock('../../../../../Provider/DeviceProvider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        device: null,
        deviceShadow: null,
    })),
}));

/**
 * Test suite for the Manual component.
 */
describe('Manual Component', () => {
    const mockHandleUpdatePumpWaterClick = jest.fn();

    const deviceConnected = { presence_connection: true };
    const deviceDisconnected = { presence_connection: false };
    const shadowPumpFalse = {
        state: {
            desired: { pump: false },
            reported: { pump: false },
        },
    };

    const shadowPumpWait = {
        state: {
            desired: { pump: true },
            reported: { pump: false },
        },
    };

    const shadowPumpTrue = {
        state: {
            desired: { pump: true },
            reported: { pump: true },
        },
    };  

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test case: renders tap image when pump is off and device is connected.
     */
    test('renders tap image when pump is off and device is connected', () => {
        (useDevice as jest.Mock).mockReturnValue({
            device: deviceConnected,
            deviceShadow: shadowPumpFalse,
        });

        render(<Manual handleUpdatePumpWaterClick={mockHandleUpdatePumpWaterClick} />);

        const tapImage = screen.getByAltText('Tap Icon');
        expect(tapImage).toBeInTheDocument();
        expect(tapImage).not.toHaveClass('flip-image');
        fireEvent.click(tapImage);
        expect(mockHandleUpdatePumpWaterClick).toHaveBeenCalled();
    });

    /**
     * Test case: renders tap_locked image when pump is off and device is not connected.
     */
    test('renders tap_locked image when pump is off and device is not connected', () => {
        (useDevice as jest.Mock).mockReturnValue({
            device: deviceDisconnected,
            deviceShadow: shadowPumpFalse,
        });

        render(<Manual handleUpdatePumpWaterClick={mockHandleUpdatePumpWaterClick} />);

        const tapLockedImage = screen.getByAltText('Tap Gray Icon');
        expect(tapLockedImage).toBeInTheDocument();
    });

    /**
     * Test case: renders time image when pump desired is sent and reported state is not true yet.
     */
    test('renders time image when pump is on and reported state is off', () => {
        (useDevice as jest.Mock).mockReturnValue({
            device: deviceConnected,
            deviceShadow: shadowPumpWait,
        });

        render(<Manual handleUpdatePumpWaterClick={mockHandleUpdatePumpWaterClick} />);

        const timeImage = screen.getByAltText('Time Icon');
        expect(timeImage).toBeInTheDocument();
        expect(timeImage).toHaveClass('flip-image');
    });

    /**
     * Test case: renders loading time image when pump desired and reported are both true.
     * Waiting for backend-to reset state.
     */
    test('renders nothing when pump state does not match any condition', () => {
        (useDevice as jest.Mock).mockReturnValue({
            device: deviceConnected,
            deviceShadow: shadowPumpTrue,
        });

        render(<Manual handleUpdatePumpWaterClick={mockHandleUpdatePumpWaterClick} />);

        const timeImage = screen.getByAltText('Time Icon');
        expect(timeImage).toBeInTheDocument();
        expect(timeImage).toHaveClass('flip-image');
    });
});
