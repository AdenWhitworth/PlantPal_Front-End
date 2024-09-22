import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes  } from 'react-router-dom';
import ForgotPassword from './ForgotPassword';
import { useChangePasswordHandlers } from '../../../Hooks/useChangePasswordHandlers';

// Mock the useChangePasswordHandlers
jest.mock('../../../Hooks/useChangePasswordHandlers', () => ({
    useChangePasswordHandlers: jest.fn(() => ({
        handleForgotPassword: jest.fn(),
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
 * Test suite for the ForgotPassword component.
 */
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
    
    /**
     * Test to ensure the ForgotPassword component renders correctly
     * with the routing context provided by `MemoryRouter`.
     */
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

    /**
     * Test to ensure the `handleForgotPassword` function is called when
     * the form is submitted with valid data.
     */
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

    /**
     * Test to ensure the component navigates back to the home page when the
     * close button is clicked.
     */
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

    /**
     * Test to ensure that any error or success messages are displayed
     * if present.
     */
    test('displays message and error when present', () => {
        const errorMessage = "This is an error message";
        const messageMessage = "This is a message";
        
        (useChangePasswordHandlers as jest.Mock).mockReturnValue({
            handleForgotPassword: jest.fn(),
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

    /**
     * Test to ensure that `resetError` and `resetMessage` functions are called
     * when the ForgotPassword component mounts.
     */
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