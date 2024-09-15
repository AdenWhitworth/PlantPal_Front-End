import React from 'react';
import { render, screen } from '@testing-library/react';
import MoistureLevel from './MoistureLevel';
import { useDevice } from '../../../../Provider/DeviceProvider';

jest.mock('../../../../Provider/DeviceProvider', () => ({
    useDevice: jest.fn(() => ({
        devices: null,
        lastLog: null,
    })),
}));

jest.mock('@mui/x-charts/Gauge', () => ({
    Gauge: () => <div data-testid="mock-gauge" />,
    gaugeClasses: {
      valueText: 'MuiGauge-valueText',
      valueArc: 'MuiGauge-valueArc',
      referenceArc: 'MuiGauge-referenceArc',
    },
}));

describe('MoistureLevel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('does not render when there are no devices', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [],
            lastLog: null,
        });

        render(<MoistureLevel />);

        const moistureElement = screen.getByText('Plant Moisture Level').closest('div');
        expect(moistureElement).toHaveClass('hidden');
    });

    test('renders and shows moisture level gauge when there are devices and lastLog has soil_cap', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            lastLog: { soil_cap: 1500 },
        });

        render(<MoistureLevel />);

        const moistureElement = screen.getByText('Plant Moisture Level').closest('div');
        expect(moistureElement).not.toHaveClass('hidden');
        expect(screen.getByText('Dry')).toBeInTheDocument();
        expect(screen.getByText('Wet')).toBeInTheDocument();
    });

    test('renders the connect message when lastLog is null', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [{ device_id: 1 }],
            lastLog: null,
        });

        render(<MoistureLevel />);

        expect(screen.getByText('Connect PlantPal to get first moisture level reading.')).toBeInTheDocument();
        expect(screen.getByAltText('Connection icon triangle')).toBeInTheDocument();
    });
});
