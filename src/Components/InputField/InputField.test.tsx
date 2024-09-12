import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from './InputField';

describe('InputField component tests', () => {
  test('renders with primary style and required attribute', () => {
    render(
      <InputField
        inputImg="Test Image"
        isRequired={true} 
        type="text" 
        placeholder="Test placeholder" 
        isSpellCheck={true} 
        isPrimaryStyle={true}
      />
    );
    
    const input = screen.getByPlaceholderText('Test placeholder');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('required');
    expect(input).toHaveAttribute('spellcheck', 'true');
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  test('renders with secondary style when isPrimaryStyle is false', () => {
    render(
      <InputField
        inputImg="Test Image"
        isSpellCheck={false}
        isRequired={false} 
        type="text" 
        placeholder="Test placeholder" 
        isPrimaryStyle={false}
      />
    );
    
    const inputWrapper = screen.getByPlaceholderText('Test placeholder').parentElement;
    expect(inputWrapper).toHaveClass('inputField-locked');
  });

  test('handles input change event', () => {
    const handleChange = jest.fn();
    render(
      <InputField
        inputImg="Test Image"
        onChange={handleChange} 
        isRequired={true} 
        type="text" 
        placeholder="Test placeholder" 
        isSpellCheck={true} 
        isPrimaryStyle={true}
      />
    );
    
    const input = screen.getByPlaceholderText('Test placeholder');
    fireEvent.change(input, { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalled();
  });

  test('applies custom width and margin styles', () => {
    render(
      <InputField
        inputImg="Test Image"
        isSpellCheck={false} 
        isRequired={true} 
        type="text" 
        placeholder="Test placeholder" 
        setWidth="50%" 
        setMarginTop="5%" 
        isPrimaryStyle={true}
      />
    );
    
    const inputWrapper = screen.getByPlaceholderText('Test placeholder').parentElement;
    expect(inputWrapper).toHaveStyle('width: 50%');
    expect(inputWrapper).toHaveStyle('margin-top: 5%');
  });

  test('renders with input image if inputImg prop is provided', () => {
    render(
      <InputField 
        isRequired={true} 
        type="text" 
        placeholder="Test placeholder" 
        inputImg="test-image.png" 
        isSpellCheck={true} 
        isPrimaryStyle={true}
      />
    );
    
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test-image.png');
    expect(img).toHaveAttribute('alt', 'Input icon');
  });

  test('disables input field when isDisabled is true', () => {
    render(
      <InputField
        inputImg="Test Image"
        isSpellCheck={false}
        isRequired={true} 
        type="text" 
        placeholder="Test placeholder" 
        isDisabled={true}
      />
    );
    
    const input = screen.getByPlaceholderText('Test placeholder');
    expect(input).toBeDisabled();
  });

  test('handles input value and name props', () => {
    render(
      <InputField
        inputImg="Test Image"
        isSpellCheck={false}
        isRequired={true} 
        type="text" 
        placeholder="Test placeholder" 
        value="Test Value" 
        name="test-input"
      />
    );
    
    const input = screen.getByPlaceholderText('Test placeholder');
    expect(input).toHaveValue('Test Value');
    expect(input).toHaveAttribute('name', 'test-input');
  });
});
