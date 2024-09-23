import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../../Provider/AuthProvider/AuthProvider';
import { useSettingsHandlers } from '../../../Hooks/useSettingsHandlers/useSettingsHandlers';
import Account from './Account';

// Mock the AuthProvider
jest.mock('../../../Provider/AuthProvider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        setAccessToken: jest.fn(),
        setUser: jest.fn(),
        accessToken: null,
    })),
}));

// Mock the useSettingsHandlers
jest.mock('../../../Hooks/useSettingsHandlers/useSettingsHandlers', () => ({
    useSettingsHandlers: jest.fn(() => ({
        handleUpdateUser: jest.fn(),
        error: null,
        resetError: jest.fn(),
    })),
}));

// Mock the react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

/**
 * Test cases for the Account component.
 */
describe('Account Component', () => {
    const mockSetUser = jest.fn();
    const mockSetAccessToken = jest.fn();
    const mockHandleUpdateUser = jest.fn();
    const mockResetError = jest.fn();
    const mockAccessToken = "token123";

    beforeEach(() => {

        jest.clearAllMocks();

        (useAuth as jest.Mock).mockReturnValue({
            setAccessToken: mockSetAccessToken,
            setUser: mockSetUser,
            accessToken: mockAccessToken,
        });

        (useSettingsHandlers as jest.Mock).mockReturnValue({
            handleUpdateUser: mockHandleUpdateUser,
            error: null,
            resetError: mockResetError,
        });
    });

    /**
     * Test case to verify that the AccountForm renders with default props.
     */
    test('renders AccountForm with default props', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<Account />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    /**
     * Test case to handle the save click and call handleUpdateUser.
     */
    test('handles save click and calls handleUpdateUser', async () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<Account />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Edit'));
        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John', name: 'firstName' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe', name: 'lastName' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'john@example.com', name: 'email' } });

        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(mockHandleUpdateUser).toHaveBeenCalledWith(
                expect.anything(),
                mockAccessToken,
                mockSetAccessToken,
                {
                    email: 'john@example.com',
                    first_name: 'John',
                    last_name: 'Doe',
                },
                expect.any(Function)
            );
        });
    });

    /**
     * Test case to verify navigation to the forgot password page when the button is clicked.
     */
    test('navigates to forgot password page when forgot password is clicked', async () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<Account />} />
                    <Route path="/forgotPassword" element={<div>Forgot Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByTestId('change-password-btn'));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/forgotPassword', { "replace": true });
        });
    });

    /**
     * Test case to verify that resetError is called on component mount.
     */
    test('calls resetError on component mount', () => {
        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route path="/dashboard" element={<Account />} />
                </Routes>
            </MemoryRouter>
        );

        expect(mockResetError).toHaveBeenCalled();
    });
});
