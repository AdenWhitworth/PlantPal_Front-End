import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SignUpForm from './SignUpForm';

/**
 * Tests for the ResetPassword component.
 */
describe('SignUpForm Component', () => {
    const mockHandleReturnHome = jest.fn();
    const mockHandleInputChange = jest.fn();
    const mockHandleSubmit = jest.fn();
    const errorMessage = 'This is an error message';

    
    /**
     * Tests rendering of the SignUpForm component.
     */
    test('renders the SignUpForm component correctly', () => {
        render(
            <SignUpForm
                handleReturnHome={mockHandleReturnHome}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={null}
                isLoading={false}
            />
        );

        expect(screen.getByAltText('PlantPal auth logo')).toBeInTheDocument();
        expect(screen.getByText('PlantPal')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Create')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /create/i })).not.toBeDisabled();
    });

    /**
     * Tests handling of input changes in the SignUpForm component.
     */
    test('handles input changes', () => {
        render(
            <SignUpForm
                handleReturnHome={mockHandleReturnHome}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={null}
                isLoading={false}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('First Name'), {
            target: { value: 'John' }
        });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), {
            target: { value: 'Doe' }
        });
        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'john.doe@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' }
        });
        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    /**
     * Tests handling of form submission in the SignUpForm component.
     */
    test('handles form submission', () => {
        render(
            <SignUpForm
                handleReturnHome={mockHandleReturnHome}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={null}
                isLoading={false}
            />
        );

        fireEvent.submit(screen.getByTestId('signup-form'));
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    /**
     * Tests the loading state of the SignUpForm component.
     */
    test('shows loading state correctly', () => {
        render(
            <SignUpForm
                handleReturnHome={mockHandleReturnHome}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={null}
                isLoading={true}
            />
        );

        expect(screen.getByText('Creating...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /creating/i })).toBeDisabled();
    });

    /**
     * Tests the display of error messages in the SignUpForm component.
     */
    test('displays error message when present', () => {
        render(
            <SignUpForm
                handleReturnHome={mockHandleReturnHome}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={errorMessage}
                isLoading={false}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});
