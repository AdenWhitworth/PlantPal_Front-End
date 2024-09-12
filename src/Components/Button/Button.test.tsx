import { render, screen, fireEvent  } from '@testing-library/react';
import React from 'react';
import Button from './Button';

describe('Button component tests', () => {
  test('renders with primary style', () => {
    render(<Button styleType="primary">Primary Button</Button>);
    const button = screen.getByText('Primary Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button-hollow');
    expect(button).toHaveClass('grow');
  });

  test('renders with secondary style', () => {
    render(<Button styleType="secondary">Secondary Button</Button>);
    const button = screen.getByText('Secondary Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('button-fill');
    expect(button).toHaveClass('grow');
  });

  test('renders with tertiary style and text wrapped in span', () => {
    render(<Button styleType="tertiary">Tertiary Button</Button>);
    const button = screen.getByText('Tertiary Button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('tertiary-button-text');
  });

  test('renders with custom className', () => {
    render(<Button styleType="primary" className="custom-class">Custom Class Button</Button>);
    const button = screen.getByText('Custom Class Button');
    expect(button).toHaveClass('custom-class');
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button styleType="primary" onClick={handleClick}>Click Me</Button>);
    const button = screen.getByText('Click Me');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  test('does not call onClick handler when button is disabled', () => {
    const handleClick = jest.fn();
    render(<Button styleType="primary" onClick={handleClick} disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('button is disabled when the disabled prop is true', () => {
    render(<Button styleType="primary" disabled>Disabled Button</Button>);
    const button = screen.getByText('Disabled Button');
    expect(button).toBeDisabled();
  });

  test('button is not disabled when the disabled prop is false', () => {
    render(<Button styleType="primary">Enabled Button</Button>);
    const button = screen.getByText('Enabled Button');
    expect(button).not.toBeDisabled();
  });

  test('renders with default type "button"', () => {
    render(<Button styleType="primary">Default Type Button</Button>);
    const button = screen.getByText('Default Type Button');
    expect(button).toHaveAttribute('type', 'button');
  });

  test('renders with type "submit"', () => {
    render(<Button styleType="primary" type="submit">Submit Button</Button>);
    const button = screen.getByText('Submit Button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  test('renders with type "reset"', () => {
    render(<Button styleType="primary" type="reset">Reset Button</Button>);
    const button = screen.getByText('Reset Button');
    expect(button).toHaveAttribute('type', 'reset');
  });
});


