import React from 'react';
import { render, screen } from '@testing-library/react';
import Auto from './Auto';
import { BarChart } from '@mui/x-charts/BarChart';

// Mocking the mui BarChart
jest.mock('@mui/x-charts/BarChart', () => ({
    BarChart: jest.fn(() => <div data-testid="mock-bar-chart"></div>),
}));

/**
 * Test suite for the Auto component.
 */
describe('Auto Component', () => {
    const mockWaterOccurance = [
        { date: '2023-09-01', times: 3 },
        { date: '2023-09-02', times: 2 },
        { date: '2023-09-03', times: 5 },
    ];

    /**
     * Test to verify the Auto component renders correctly.
     */
    test('renders the Auto component correctly', () => {
        render(<Auto waterOccurance={mockWaterOccurance} />);
        expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    });

    /**
     * Test to ensure the correct dataset is passed to the BarChart component.
     */
    test('passes the correct dataset to the BarChart component', () => {
        render(<Auto waterOccurance={mockWaterOccurance} />);

        const expectedDataset = [
            { date: '2023-09-01', times: 3 },
            { date: '2023-09-02', times: 2 },
            { date: '2023-09-03', times: 5 },
        ];

        expect(BarChart).toHaveBeenCalledWith(
            expect.objectContaining({
                dataset: expectedDataset,
            }),
            {}
        );
    });

    /**
     * Test to verify that an empty BarChart is rendered when waterOccurance is empty.
     */
    test('renders an empty BarChart when waterOccurance is empty', () => {
        render(<Auto waterOccurance={[]} />);

        expect(BarChart).toHaveBeenCalledWith(
            expect.objectContaining({
                dataset: [],
            }),
            {}
        );
    });
});
