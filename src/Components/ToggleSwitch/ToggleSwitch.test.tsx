import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ToggleSwitch from './ToggleSwitch';

describe('ToggleSwitch component tests', () => {
  test('renders the switch with the correct label', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="Test Label" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toBeInTheDocument();
  });

  test('switch is checked when passed checked prop is true', () => {
    render(<ToggleSwitch checked={true} onChange={() => {}} label="Test Label" />);
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).toBeChecked();
  });

  test('switch is unchecked when passed checked prop is false', () => {
    render(<ToggleSwitch checked={false} onChange={() => {}} label="Test Label" />);
    const switchInput = screen.getByRole('checkbox');
    expect(switchInput).not.toBeChecked();
  });

  test('calls onChange handler when switch is toggled', () => {
    const handleChange = jest.fn();
    render(<ToggleSwitch checked={false} onChange={handleChange} label="Test Label" />);
    const switchInput = screen.getByRole('checkbox'); 
    fireEvent.click(switchInput);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
