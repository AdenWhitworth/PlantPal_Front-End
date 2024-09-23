import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { postForgotPassword, postResetPassword } from '../../Services/ApiService/ApiService';
import { useChangePasswordHandlers } from './useChangePasswordHandlers';

// Mocking the ApiService
jest.mock('../../Services/ApiService/ApiService', () => ({
    postForgotPassword: jest.fn(),
    postResetPassword: jest.fn(),
}));

/**
 * Test component for demonstrating the use of change password handlers.
 * 
 * @component
 * @returns {JSX.Element} The rendered component.
 */
const TestComponent = () => {
    const {
        handleForgotPassword,
        handlePasswordReset,
        error,
        message,
        isLoading,
        resetError,
        resetMessage
    } = useChangePasswordHandlers();

    return (
        <div>
            <button onClick={() => handleForgotPassword({ email: 'test@example.com' })}>Forgot Password</button>
            <button
                onClick={() => handlePasswordReset(
                    { password: 'password123', resetToken: 'token123', user_id: 'user123' },
                    'password123'
                )}
            >
                Reset Password
            </button>
            <div data-testid="error">{error}</div>
            <div data-testid="message">{message}</div>
            <div data-testid="loading">{isLoading ? 'Loading...' : 'Not Loading'}</div>
        </div>
    );
};

/**
 * Tests for the useChangePasswordHandlers hook.
 */
describe('useChangePasswordHandlers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * Tests the successful handling of a forgot password request.
     */
    it('should handle forgot password request successfully', async () => {
        (postForgotPassword as jest.Mock).mockResolvedValue({});

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Forgot Password'));

        await waitFor(() => {
            expect(screen.getByTestId('message')).toHaveTextContent(
                'We have sent password recover instructions to your email.'
            );
            expect(screen.getByTestId('error')).toBeEmptyDOMElement();
        });
    });

    /**
     * Tests the handling of a failed forgot password request.
     */
    it('should handle forgot password request failure', async () => {
        (postForgotPassword as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Forgot Password'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent(
                'Error sending password reset email'
            );
            expect(screen.getByTestId('message')).toBeEmptyDOMElement();
        });
    });

    /**
     * Tests the successful handling of a password reset request.
     */
    it('should handle password reset request successfully', async () => {
        (postResetPassword as jest.Mock).mockResolvedValue({});

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Reset Password'));

        await waitFor(() => {
            expect(screen.getByTestId('message')).toHaveTextContent(
                'Success resetting the password. Please log in with the new credentials.'
            );
            expect(screen.getByTestId('error')).toBeEmptyDOMElement();
        });
    });

    /**
     * Tests the handling of a failed password reset request.
     */
    it('should handle password reset request failure', async () => {
        (postResetPassword as jest.Mock).mockRejectedValue(new Error('Network error'));

        render(<TestComponent />);

        fireEvent.click(screen.getByText('Reset Password'));

        await waitFor(() => {
            expect(screen.getByTestId('error')).toHaveTextContent(
                'Error resetting password. Please try again.'
            );
            expect(screen.getByTestId('message')).toBeEmptyDOMElement();
        });
    });
});