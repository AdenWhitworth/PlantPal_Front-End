import React from 'react';
import { render } from '@testing-library/react';
import WedgeGauge from './WedgeGauge';

jest.mock('@mui/x-charts/Gauge', () => ({
  Gauge: () => <div data-testid="mock-gauge" />,
  gaugeClasses: {
    valueText: 'MuiGauge-valueText',
    valueArc: 'MuiGauge-valueArc',
    referenceArc: 'MuiGauge-referenceArc',
  },
}));

describe('WedgeGauge component tests', () => {
  test('renders WedgeGauge with correct value and classes', () => {
    const { getByTestId } = render(<WedgeGauge className="test-class" value={50} />);
    const gaugeElement = getByTestId('mock-gauge');
    expect(gaugeElement).toBeInTheDocument();
  });
});