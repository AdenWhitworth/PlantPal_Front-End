import React from 'react';
import { render, screen } from '@testing-library/react';
import Auto from './Auto';
import { BarChart } from '@mui/x-charts/BarChart';

jest.mock('@mui/x-charts/BarChart', () => ({
    BarChart: jest.fn(() => <div data-testid="mock-bar-chart"></div>),
}));

describe('Auto Component', () => {
    const mockWaterOccurance = [
        { date: '2023-09-01', times: 3 },
        { date: '2023-09-02', times: 2 },
        { date: '2023-09-03', times: 5 },
    ];

    test('renders the Auto component correctly', () => {
        render(<Auto waterOccurance={mockWaterOccurance} />);
        expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
    });

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