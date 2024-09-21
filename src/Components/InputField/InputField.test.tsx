import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InputField from './InputField';

/**
 * Tests for the InputField component.
 */
describe('InputField component tests', () => {

  /**
   * Test to ensure the InputField renders with primary style and required attribute.
   */
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

  /**
   * Test to ensure InputField renders with secondary style when `isPrimaryStyle` is false.
   */
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

  /**
   * Test to ensure InputField correctly handles the input change event.
   */
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

  /**
   * Test to ensure custom width and margin styles are applied.
   */
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

  /**
   * Test to ensure InputField renders with an input image if the `inputImg` prop is provided.
   */
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

  /**
   * Test to ensure the input field is disabled when the `isDisabled` prop is true.
   */
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

  /**
   * Test to ensure InputField handles the `value` and `name` props.
   */
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

