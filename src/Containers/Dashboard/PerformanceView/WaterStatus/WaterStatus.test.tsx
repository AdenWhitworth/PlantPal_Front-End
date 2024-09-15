import React from 'react';
import { render, screen } from '@testing-library/react';
import WaterStatus from './WaterStatus';
import { useDevice } from '../../../../Provider/DeviceProvider';

jest.mock('../../../../Provider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        devices: null,
        lastLog: null,
    })),
}));

describe('WaterStatus Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('displays "Needs Water" when soil_cap is below the target', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            lastLog: { soil_cap: 500 },
        });

        render(<WaterStatus />);

        expect(screen.getByText('Needs Water')).toBeInTheDocument();
        expect(screen.getByAltText('Status icon cross')).toBeInTheDocument();
        expect(screen.getByText('Needs Water')).toHaveClass('bad-water');
    });

    test('displays "Sufficient Water" when soil_cap is above the target', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            lastLog: { soil_cap: 700 },
        });

        render(<WaterStatus />);

        expect(screen.getByText('Sufficient Water')).toBeInTheDocument();
        expect(screen.getByAltText('Status icon check')).toBeInTheDocument();
        expect(screen.getByText('Sufficient Water')).toHaveClass('good-water');
    });

    test('displays default state when no lastLog is available', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            lastLog: null,
        });

        render(<WaterStatus />);
        expect(screen.getByAltText('Status icon triangle')).toBeInTheDocument();
    });

    test('does not render when there are no devices', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [],
            lastLog: null,
        });

        render(<WaterStatus />);

        const statusElement = screen.getByText('Water Status').closest('div');
        expect(statusElement).toHaveClass('hidden');
    });
});
