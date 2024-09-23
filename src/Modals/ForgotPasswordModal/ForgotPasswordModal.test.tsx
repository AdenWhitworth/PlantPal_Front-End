import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForgotPasswordModal from './ForgotPasswordModal';

/**
 * Tests for the ForgotPasswordModal component.
 */
describe('ForgotPasswordModal Component', () => {
    const mockHandleReturnHome = jest.fn();
    const mockHandleInputChange = jest.fn();
    const mockHandleSubmit = jest.fn();

    /**
     * Test to check the initial rendering of the ForgotPasswordModal component.
     */
    test('renders the ForgotPasswordModal with correct initial state', () => {
        render(
            <ForgotPasswordModal
                handleReturnHome={mockHandleReturnHome}
                message={null}
                error={null}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        expect(screen.getByTestId("reset-password-title")).toBeInTheDocument();
        expect(screen.getByText(/Enter the email associated with your account/)).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByText('Send Instructions')).toBeInTheDocument();
    });

    /**
     * Test to ensure handleSubmit is called when the form is submitted.
     */
    test('calls handleSubmit when form is submitted', () => {
        render(
            <ForgotPasswordModal
                handleReturnHome={mockHandleReturnHome}
                message={null}
                error={null}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        fireEvent.submit(screen.getByTestId('forgot-form'));
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    /**
     * Test to check if error and message are displayed correctly when provided.
     */
    test('displays error and message if provided', () => {
        const message = "Reset link sent to your email!";
        const error = "Invalid email address";

        render(
            <ForgotPasswordModal
                handleReturnHome={mockHandleReturnHome}
                message={message}
                error={error}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );
        expect(screen.getByText('Invalid email address')).toBeInTheDocument();
        expect(screen.getByText('Reset link sent to your email!')).toBeInTheDocument();
    });

    /**
     * Test to ensure handleReturnHome is called when the modal is closed.
     */
    test('calls handleReturnHome when modal is closed', () => {
        render(
            <ForgotPasswordModal
                handleReturnHome={mockHandleReturnHome}
                message={null}
                error={null}
                handleInputChange={mockHandleInputChange}
                handleSubmit={mockHandleSubmit}
            />
        );

        fireEvent.click(screen.getByAltText('Close Icon'));
        expect(mockHandleReturnHome).toHaveBeenCalled();
    });
});
