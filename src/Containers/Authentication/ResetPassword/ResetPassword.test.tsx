import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes  } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { useChangePasswordHandlers } from '../../../Hooks/useChangePasswordHandlers';

jest.mock('../../../Hooks/useChangePasswordHandlers', () => ({
    useChangePasswordHandlers: jest.fn(() => ({
        handlePasswordReset: jest.fn(),
        error: null,
        resetError: jest.fn(),
        message: null,
        resetMessage: jest.fn(),
    })),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

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
