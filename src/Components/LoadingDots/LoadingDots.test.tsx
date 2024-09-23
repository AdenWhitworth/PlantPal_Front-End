import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingDots from './LoadingDots';

/**
 * Tests for the LoadingDots component.
 */
describe('LoadingDots component', () => {

  /**
   * Test to ensure the LoadingDots component renders with the correct structure.
   *
   * This test checks that the component renders a container with the 
   * correct test ID and class name, and verifies that it contains
   * exactly three child `div` elements representing the loading dots.
   */
  test('renders loading dots with the correct structure', () => {
    render(<LoadingDots />);
    
    const container = screen.getByTestId('loading-dots');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('loading-dots');

    const dots = container.querySelectorAll('div');
    expect(dots).toHaveLength(3);
  });
});
