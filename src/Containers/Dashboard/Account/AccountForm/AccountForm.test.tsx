import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useAuth } from '../../../../Provider/AuthProvider/AuthProvider';
import AccountForm from './AccountForm';

// Mock the AuthProvider
jest.mock('../../../../Provider/AuthProvider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        user: null,
    })),
}));

/**
 * Tests for the AccountForm component.
 */
describe('AccountForm Component', () => {
    const mockHandleReturnForgotPassword = jest.fn();
    const mockHandleInputChange = jest.fn();
    const mockHandleSaveClick = jest.fn();
    const mockHandleEditClick = jest.fn();
    const mockHandleCloseClick = jest.fn();
    const errorMessage = 'This is an error message';
    const mockUser = {
        first_name: "John",
        last_name: "Doe",
        email: "john@gmail.com",
        user_id: 1,
    }

    beforeEach(() => {

        jest.clearAllMocks();

        (useAuth as jest.Mock).mockReturnValue({
            user: mockUser,
        });
    });

    /**
     * Test that verifies the AccountForm renders correctly.
     */
    test('renders the AccountForm component correctly', () => {
        render(
            <AccountForm
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                error={null}
                handleSaveClick={mockHandleSaveClick}
                handleEditClick={mockHandleEditClick}
                editToggle={false}
                inputDisabled={true}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        expect(screen.queryByAltText('Close Icon')).not.toBeInTheDocument();
        expect(screen.getByPlaceholderText(mockUser.first_name)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(mockUser.last_name)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(mockUser.email)).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    /**
     * Test that verifies the AccountForm in edit mode renders correctly.
     */
    test('renders the AccountForm edit component correctly', () => {
        render(
            <AccountForm
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                error={null}
                handleSaveClick={mockHandleSaveClick}
                handleEditClick={mockHandleEditClick}
                editToggle={true}
                inputDisabled={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );
        
        expect(screen.queryByAltText('Close Icon')).toBeInTheDocument();
        expect(screen.getByPlaceholderText("First Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Last Name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    /**
     * Test that verifies inputs are disabled when editing is not enabled.
     */
    test('doesnt allow editing by default', () => {
        render(
            <AccountForm
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                error={null}
                handleSaveClick={mockHandleSaveClick}
                handleEditClick={mockHandleEditClick}
                editToggle={false}
                inputDisabled={true}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        const inputFirstName = screen.getByPlaceholderText(mockUser.first_name);
        const inputLastName = screen.getByPlaceholderText(mockUser.last_name);
        const inputEmail = screen.getByPlaceholderText(mockUser.email);

        expect(inputFirstName).toBeDisabled();
        expect(inputLastName).toBeDisabled();
        expect(inputEmail).toBeDisabled();
    });

    /**
     * Test that verifies input changes are handled correctly when editing is enabled.
     */
    test('allows input changes when editing is enabled', () => {
        render(
            <AccountForm
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                error={null}
                handleSaveClick={mockHandleSaveClick}
                handleEditClick={mockHandleEditClick}
                editToggle={true}
                inputDisabled={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John', name: 'firstName' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe', name: 'lastName' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com', name: 'email' } });

        expect(mockHandleInputChange).toHaveBeenCalledTimes(3);
    });

    /**
     * Test that verifies form submission is handled correctly.
     */
    test('handles form submission', () => {
        render(
            <AccountForm
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                error={null}
                handleSaveClick={mockHandleSaveClick}
                handleEditClick={mockHandleEditClick}
                editToggle={true}
                inputDisabled={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        fireEvent.submit(screen.getByTestId('account-form'));
        expect(mockHandleSaveClick).toHaveBeenCalled();
    });

    /**
     * Test that verifies error messages are displayed when present.
     */
    test('displays error message when present', () => {
        render(
            <AccountForm
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                error={errorMessage}
                handleSaveClick={mockHandleSaveClick}
                handleEditClick={mockHandleEditClick}
                editToggle={false}
                inputDisabled={true}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    /**
     * Test that verifies the change password button click is handled correctly.
     */
    test('handles change password click', () => {
        render(
            <AccountForm
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                error={null}
                handleSaveClick={mockHandleSaveClick}
                handleEditClick={mockHandleEditClick}
                editToggle={false}
                inputDisabled={true}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        fireEvent.click(screen.getByTestId('change-password-btn'));
        expect(mockHandleReturnForgotPassword).toHaveBeenCalled();
    });

    /**
     * Test that verifies the close button click is handled correctly.
     */
    test('handles close click', () => {
        render(
            <AccountForm
                handleReturnForgotPassword={mockHandleReturnForgotPassword}
                handleInputChange={mockHandleInputChange}
                error={null}
                handleSaveClick={mockHandleSaveClick}
                handleEditClick={mockHandleEditClick}
                editToggle={true}
                inputDisabled={false}
                handleCloseClick={mockHandleCloseClick}
            />
        );

        const closeButton = screen.getByAltText('Close Icon');
        expect(closeButton).toBeInTheDocument();
        fireEvent.click(closeButton);
        expect(mockHandleCloseClick).toHaveBeenCalled();
    });

});
