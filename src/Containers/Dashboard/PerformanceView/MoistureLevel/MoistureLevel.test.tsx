import React from 'react';
import { render, screen } from '@testing-library/react';
import MoistureLevel from './MoistureLevel';
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';

jest.mock('../../../../Provider/DeviceProvider/DeviceProvider', () => ({
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

/**
 * Test suite for the MoistureLevel component.
 */
describe('MoistureLevel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Test to ensure the component does not render when there are no devices.
     */
    test('does not render when there are no devices', () => {
        (useDevice as jest.Mock).mockReturnValue({
            devices: [],
            lastLog: null,
        });

        render(<MoistureLevel />);

        const moistureElement = screen.getByText('Plant Moisture Level').closest('div');
        expect(moistureElement).toHaveClass('hidden');
    });

    /**
     * Test to check if the moisture level gauge is rendered when devices are present
     * and lastLog contains a soil capacitance value.
     */
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

    /**
     * Test to ensure the connect message is rendered when lastLog is null.
     */
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
