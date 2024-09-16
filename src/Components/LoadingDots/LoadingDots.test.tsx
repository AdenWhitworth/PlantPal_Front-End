import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingDots from './LoadingDots';

describe('LoadingDots component', () => {
  test('renders loading dots with the correct structure', () => {
    render(<LoadingDots />);
    
    const container = screen.getByTestId('loading-dots');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loading-dots');

    const dots = container.querySelectorAll('div');
    expect(dots).toHaveLength(3);
  });
});
