import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes  } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { useChangePasswordHandlers } from '../../../Hooks/useChangePasswordHandlers';

// Mock the useChangePasswordHandlers
jest.mock('../../../Hooks/useChangePasswordHandlers', () => ({
    useChangePasswordHandlers: jest.fn(() => ({
        handlePasswordReset: jest.fn(),
        error: null,
        resetError: jest.fn(),
        message: null,
        resetMessage: jest.fn(),
    })),
}));

// Mock the react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

/**
 * Tests for the ResetPassword component.
 */
describe('ResetPassword Component', () => {
    const mockHandlePasswordReset = jest.fn();
    const mockResetError = jest.fn();
    const mockResetMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useChangePasswordHandlers as jest.Mock).mockReturnValue({
            handlePasswordReset: mockHandlePasswordReset,
            error: null,
            resetError: mockResetError,
            message: null,
            resetMessage: mockResetMessage,
        });
    });
    
    /**
     * Tests if the ResetPassword component renders correctly within a routing context.
     */
    test('renders ResetPassword component with routing context', () => {
        render(
            <MemoryRouter initialEntries={['/reset-password?resetToken=token123&user_id=1']}>
                <Routes>
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('reset-password-title')).toHaveTextContent('Reset Password');
    });

    /**
     * Tests the form submission with valid data to ensure handlePasswordReset is called.
     */
    test('calls handlePasswordReset when form is submitted with valid data', async () => {
        render(
            <MemoryRouter initialEntries={['/reset-password?resetToken=token123&user_id=1']}>
                <Routes>
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpassword' } });
        fireEvent.submit(screen.getByTestId('reset-form'));

        await waitFor(() => {
            expect(mockHandlePasswordReset).toHaveBeenCalledWith(
                {
                    password: 'newpassword',
                    resetToken: 'token123',
                    user_id: '1',
                },
                'newpassword',
                expect.any(Function)
            );
        });
    });

    /**
     * Tests navigation to home if no resetToken or userId is provided on form submission.
     */
    test('navigates to home if no resetToken or userId', () => {
        render(
            <MemoryRouter initialEntries={['/reset-password']}>
                <Routes>
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.submit(screen.getByTestId('reset-form'));
        expect(mockNavigate).toHaveBeenCalledWith("/", {"replace": true});
    });

    /**
     * Tests navigation to the auth page after a successful password reset.
     */
    test('navigates to auth page after successful password reset', async () => {
        (useChangePasswordHandlers as jest.Mock).mockReturnValue({
            handlePasswordReset: jest.fn((data, confirmPassword, callback) => {
                callback();
            }),
            error: null,
            resetError: jest.fn(),
            message: null,
            resetMessage: jest.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/reset-password?resetToken=token123&user_id=1']}>
                <Routes>
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/auth" element={<div>Auth Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('New Password'), { target: { value: 'newpassword' } });
        fireEvent.change(screen.getByPlaceholderText('Confirm Password'), { target: { value: 'newpassword' } });
        fireEvent.submit(screen.getByTestId('reset-form'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith("/auth", {"replace": true});
        });
    });

    /**
     * Tests the display of error and message when they are present.
     */
    test('displays message and error when present', () => {
        const errorMessage = "This is an error message";
        const messageMessage = "This is a message";
        
        (useChangePasswordHandlers as jest.Mock).mockReturnValue({
            handlePasswordReset: jest.fn(),
            error: errorMessage,
            resetError: jest.fn(),
            message: messageMessage,
            resetMessage: jest.fn(),
        });

        render(
            <MemoryRouter initialEntries={['/reset-password?resetToken=token123&user_id=1']}>
                <Routes>
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByText(messageMessage)).toBeInTheDocument();
    });

    /**
     * Tests that the error and message are reset when the component mounts.
     */
    test('resets error and message on mount', () => {
        render(
            <MemoryRouter initialEntries={['/reset-password?resetToken=token123&user_id=1']}>
                <Routes>
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
            </MemoryRouter>
        );

        expect(mockResetError).toHaveBeenCalled();
        expect(mockResetMessage).toHaveBeenCalled();
    });

});
