import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ResetPasswordModal from './ResetPasswordModal';

describe('ResetPasswordModal Component', () => {
    const handleReturnHome = jest.fn();
    const handleInputChange = jest.fn();
    const handleSubmit = jest.fn();

    test('renders ResetPasswordModal with correct initial state', () => {
        render(
            <ResetPasswordModal 
                handleReturnHome={handleReturnHome}
                message={null}
                error={null}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        );

        expect(screen.getByTestId("reset-password-title")).toBeInTheDocument();
        expect(screen.getByPlaceholderText('New Password')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
        expect(screen.getByTestId("reset-password-btn")).toBeInTheDocument();
        expect(screen.queryByText('Accept')).not.toBeInTheDocument();
        expect(screen.getByAltText('Close Icon')).toBeInTheDocument();
    });

    test('calls handleInputChange on input change', () => {
        render(
            <ResetPasswordModal 
                handleReturnHome={handleReturnHome}
                message={null}
                error={null}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword123' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpassword123' } });

        expect(handleInputChange).toHaveBeenCalledTimes(2);
    });

    test('calls handleSubmit on form submit', async () => {
        render(
            <ResetPasswordModal 
                handleReturnHome={handleReturnHome}
                message={null}
                error={null}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        );

        fireEvent.submit(screen.getByTestId('reset-form'));

        expect(handleSubmit).toHaveBeenCalled();
    });

    test('displays message and error if provided', () => {
        const message = "Password reset link sent!";
        const error = "Error resetting password";

        render(
            <ResetPasswordModal 
                handleReturnHome={handleReturnHome}
                message={message}
                error={error}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        );

        expect(screen.getByText(message)).toBeInTheDocument();
        expect(screen.getByText(error)).toBeInTheDocument();
    });

    test('calls handleReturnHome when modal is closed', () => {
        render(
            <ResetPasswordModal 
                handleReturnHome={handleReturnHome}
                message={null}
                error={null}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        );

        fireEvent.click(screen.getByAltText('Close Icon'));

        expect(handleReturnHome).toHaveBeenCalled();
    });
});
