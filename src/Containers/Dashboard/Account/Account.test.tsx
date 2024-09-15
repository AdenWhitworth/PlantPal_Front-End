import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../../Provider/AuthProvider';
import { useSettingsHandlers } from '../../../Hooks/useSettingsHandlers';
import Account from './Account';

jest.mock('../../../Provider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        setAccessToken: jest.fn(),
        setUser: jest.fn(),
        accessToken: null,
    })),
}));

jest.mock('../../../Hooks/useSettingsHandlers', () => ({
    useSettingsHandlers: jest.fn(() => ({
        handleUpdateUser: jest.fn(),
        error: null,
        resetError: jest.fn(),
    })),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

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
            expect(mockNavigate).toHaveBeenCalledWith('/forgotPassword', { "replace": true })
        });
    });

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
