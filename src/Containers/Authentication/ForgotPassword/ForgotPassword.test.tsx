import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes  } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { useChangePasswordHandlers } from '../../../Hooks/useChangePasswordHandlers';

jest.mock('../../../Hooks/useChangePasswordHandlers', () => ({
    useChangePasswordHandlers: jest.fn(() => ({
        handleForgotPassword: jest.fn(),
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

describe('ForgotPassword Component', () => {
    const mockHandleForgotPassword = jest.fn();
    const mockResetError = jest.fn();
    const mockResetMessage = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useChangePasswordHandlers as jest.Mock).mockReturnValue({
            handleForgotPassword: mockHandleForgotPassword,
            error: null,
            resetError: mockResetError,
            message: null,
            resetMessage: mockResetMessage,
        });
    });
    
    test('renders ForgotPassword component with routing context', () => {
        render(
            <MemoryRouter initialEntries={['/forgot-password']}>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByTestId('reset-password-title')).toHaveTextContent('Reset Password');
    });

    test('calls handleForgotPassword when form is submitted with valid data', async () => {
        render(
            <MemoryRouter initialEntries={['/forgot-password']}>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@email.com' } });
        fireEvent.submit(screen.getByTestId('forgot-form'));

        await waitFor(() => {
            expect(mockHandleForgotPassword).toHaveBeenCalledWith({
                email: 'test@email.com',
            });
        });
    });

    test('navigates home when close button is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/forgot-password']}>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByAltText('Close Icon'));
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
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
            <MemoryRouter initialEntries={['/forgot-password']}>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.getByText(messageMessage)).toBeInTheDocument();
    });

    test('resets error and message on mount', () => {
        render(
            <MemoryRouter initialEntries={['/forgot-password']}>
                <Routes>
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                </Routes>
            </MemoryRouter>
        );

        expect(mockResetError).toHaveBeenCalled();
        expect(mockResetMessage).toHaveBeenCalled();
    });
});