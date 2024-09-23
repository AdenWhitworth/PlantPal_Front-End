import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvider/AuthProvider';
import { useSocket } from '../../Provider/SocketProvider/SocketProvider';
import { useAuthHandlers } from '../../Hooks/useAuthHandlers';
import Authentication from './Authentication';

// Mock the AuthProvider
jest.mock('../../Provider/AuthProvider/AuthProvider', () => ({
    useAuth: jest.fn(() => ({
        setAccessToken: jest.fn(),
        setUser: jest.fn(),
        accessToken: null,
    })),
}));

// Mock the SocketProvider
jest.mock('../../Provider/SocketProvider/SocketProvider', () => ({
    useSocket: jest.fn(() => ({
        connectSocket: jest.fn(),
        isConnected: false,
    })),
}));

// Mock the useAuthHandlers
jest.mock('../../Hooks/useAuthHandlers', () => ({
    useAuthHandlers: jest.fn(() => ({
        handleSignIn: jest.fn(),
        handleSignUp: jest.fn(),
        error: null,
        isLoading: false,
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
 * Test cases for the Authentication component.
 */
describe('Authentication Component', () => {
    const mockSetAccessToken = jest.fn();
    const mockSetUser = jest.fn();
    const mockConnectSocket = jest.fn();
    const mockHandleSignIn = jest.fn();
    const mockHandleSignUp = jest.fn();
    const mockResetError = jest.fn();

    /**
     * Clears all mocks before each test to ensure a clean state.
     */
    beforeEach(() => {
        jest.clearAllMocks();

        (useAuth as jest.Mock).mockReturnValue({
            setAccessToken: mockSetAccessToken,
            setUser: mockSetUser,
            accessToken: null,
        });

        (useSocket as jest.Mock).mockReturnValue({
            connectSocket: mockConnectSocket,
            isConnected: false,
        });

        (useAuthHandlers as jest.Mock).mockReturnValue({
            handleSignIn: mockHandleSignIn,
            handleSignUp: mockHandleSignUp,
            error: null,
            isLoading: false,
            resetError: mockResetError,
        });
    });

    /**
     * Test case to ensure that the login form is rendered by default.
     */
    test('renders login form by default', () => {
        render(
            <MemoryRouter initialEntries={['/auth']}>
                <Routes>
                    <Route path="/auth" element={<Authentication />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    /**
     * Test case to ensure that the signup form is displayed when toggled.
     */
    test('switches to signup form when toggled', () => {
        render(
            <MemoryRouter initialEntries={['/auth']}>
                <Routes>
                    <Route path="/auth" element={<Authentication />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Sign Up'));

        expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
        expect(screen.getByText('Create')).toBeInTheDocument();
    });

    /**
     * Test case to verify that the handleSignIn function is called when the login form is submitted.
     */
    test('calls handleSignIn when login form is submitted', () => {
        render(
            <MemoryRouter initialEntries={['/auth']}>
                <Routes>
                    <Route path="/auth" element={<Authentication />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByTestId('login-form'));

        expect(mockHandleSignIn).toHaveBeenCalledWith(
            expect.anything(),
            { email: 'test@example.com', password: 'password123' },
            expect.any(Function)
        );
    });

    /**
     * Test case to verify that the handleSignUp function is called when the signup form is submitted.
     */
    test('calls handleSignUp when signup form is submitted', () => {
        render(
            <MemoryRouter initialEntries={['/auth']}>
                <Routes>
                    <Route path="/auth" element={<Authentication />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Sign Up'));

        fireEvent.change(screen.getByPlaceholderText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByPlaceholderText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'test@example.com' } });
        fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });

        fireEvent.submit(screen.getByTestId('signup-form'));

        expect(mockHandleSignUp).toHaveBeenCalledWith(
            expect.anything(),
            {
                email: 'test@example.com',
                password: 'password123',
                first_name: 'John',
                last_name: 'Doe',
            },
            expect.any(Function)
        );
    });

    /**
     * Test case to verify that navigation to the dashboard occurs when an access token is present and the socket is connected.
     */
    test('navigates to dashboard when access token and socket are connected', async () => {
        (useAuth as jest.Mock).mockReturnValue({
            setAccessToken: mockSetAccessToken,
            setUser: mockSetUser,
            accessToken: 'fakeAccessToken',
        });

        (useSocket as jest.Mock).mockReturnValue({
            connectSocket: mockConnectSocket,
            isConnected: true,
        });

        render(
            <MemoryRouter initialEntries={['/auth']}>
                <Routes>
                    <Route path="/auth" element={<Authentication />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
        });
    });

    /**
     * Test case to verify that navigation to the forgot password page occurs when the forgot password link is clicked.
     */
    test('navigates to forgot password page when clicked', () => {
        render(
            <MemoryRouter initialEntries={['/auth']}>
                <Routes>
                    <Route path="/auth" element={<Authentication />} />
                    <Route path="/forgotPassword" element={<div>Forgot Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Forgot Password?'));

        expect(mockNavigate).toHaveBeenCalledWith('/forgotPassword', { replace: true });
    });

    /**
     * Test case to verify that navigation to the home page occurs from the login form when the logo button is clicked.
     */
    test('navigates to home page from login when Logo button is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/auth']}>
                <Routes>
                    <Route path="/auth" element={<Authentication />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByAltText('PlantPal auth logo'));
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    /**
     * Test case to verify that navigation to the home page occurs from the signup form when the logo button is clicked.
     */
    test('navigates to home page from sign up when Logo button is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/auth']}>
                <Routes>
                    <Route path="/auth" element={<Authentication />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Sign Up'));
        fireEvent.click(screen.getByAltText('PlantPal auth logo'));
        expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
});
