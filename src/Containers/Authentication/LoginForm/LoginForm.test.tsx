import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginForm from './LoginForm';

/**
 * Test suite for the LoginForm component.
 */
describe('LoginForm Component', () => {
    const mockHandleReturnHome = jest.fn();
    const mockHandleReturnForgotPassword = jest.fn();
    const mockHandleInputChange = jest.fn();
    const mockHandleSubmit = jest.fn();
    const errorMessage = 'This is an error message';

    /**
     * Test to ensure the LoginForm component renders correctly.
     */
    test('renders the LoginForm component correctly', () => {
        render(
            <LoginForm
                handleReturnHome={mockHandleReturnHome}
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={null}
                isLoading={false}
            />
        );

        expect(screen.getByAltText('PlantPal auth logo')).toBeInTheDocument();
        expect(screen.getByText('PlantPal')).toBeInTheDocument();

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

        expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    /**
     * Test to verify that input changes are handled correctly.
     */
    test('handles input changes', () => {
        render(
            <LoginForm
                handleReturnHome={mockHandleReturnHome}
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={null}
                isLoading={false}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), {
            target: { value: 'john.doe@example.com' }
        });
        fireEvent.change(screen.getByPlaceholderText('Password'), {
            target: { value: 'password123' }
        });

        expect(mockHandleInputChange).toHaveBeenCalled();
    });

    /**
     * Test to ensure the form submission is handled correctly.
     */
    test('handles form submission', () => {
        render(
            <LoginForm
                handleReturnHome={mockHandleReturnHome}
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={null}
                isLoading={false}
            />
        );

        fireEvent.submit(screen.getByTestId('login-form'));
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    /**
     * Test to check the loading state of the form.
     */
    test('shows loading state correctly', () => {
        render(
            <LoginForm
                handleReturnHome={mockHandleReturnHome}
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={null}
                isLoading={true}
            />
        );
        expect(screen.getByText('Signing In...')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Signing/i })).toBeDisabled();
    });

    /**
     * Test to verify that an error message is displayed when present.
     */
    test('displays error message when present', () => {
        render(
            <LoginForm
                handleReturnHome={mockHandleReturnHome}
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
                error={errorMessage}
                isLoading={false}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});
