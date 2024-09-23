/**
 * Tests for the ToggleSwitch component.
 *
 * @module ToggleSwitchTests
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch component tests', () => {
  
  /**
   * Test rendering the switch with the correct label.
   */
  test('renders the switch with the correct label', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toBeInTheDocument();
  });

  /**
   * Test that the switch is checked when the checked prop is true.
   */
  test('switch is checked when passed checked prop is true', () => {
    render(<ToggleSwitch checked={true} onChange={() => {}} label="Test Label" />);
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toBeChecked();
  });

  /**
   * Test that the switch is unchecked when the checked prop is false.
   */
  test('switch is unchecked when passed checked prop is false', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="Test Label" />);
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).not.toBeChecked();
  });

  /**
   * Test that the onChange handler is called when the switch is toggled.
   */
  test('calls onChange handler when switch is toggled', () => {
    const handleChange = jest.fn();
    render(<ToggleSwitch checked={false} onChange={handleChange} label="Test Label" />);
    const switchInput = screen.getByRole('checkbox'); 
    fireEvent.click(switchInput);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

