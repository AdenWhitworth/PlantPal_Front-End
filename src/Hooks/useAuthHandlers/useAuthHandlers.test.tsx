import React, { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthHandlers } from './useAuthHandlers';
import { postLogin, postRegister } from '../../Services/ApiService/ApiService';
import { TestComponentProps } from './useAuthHandlersTypes';

//Mocking the ApiService
jest.mock('../../Services/ApiService/ApiService', () => ({
  postLogin: jest.fn(),
  postRegister: jest.fn(),
}));

/**
 * Test component to simulate the usage of useAuthHandlers hook.
 *
 * @component
 * @param {TestComponentProps} props - The props for TestComponent.
 * @returns {JSX.Element} The rendered test component.
 */
const TestComponent: React.FC<TestComponentProps> = ({ setAccessToken, setUser, isLoginSelected }: TestComponentProps): JSX.Element => {
  const authHandlers = useAuthHandlers({ setAccessToken, setUser, isLoginSelected });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  
  /**
   * Handles the form submission for login or signup.
   * 
   * @function
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (isLoginSelected) {
      authHandlers.handleSignIn(e, { email, password });
    } else {
      authHandlers.handleSignUp(e, { email, password, first_name: firstName, last_name: lastName });
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="test-form">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
            {authHandlers.error && <span>{authHandlers.error}</span>}
    </form>
  );
};

/**
 * Tests for the useAuthHandlers hook.
 */
describe('useAuthHandlers', () => {
    const mockSetAccessToken = jest.fn();
    const mockSetUser = jest.fn();

  beforeEach(() => {
    jest.resetAllMocks();
  });

  /**
   * Test case: should validate login form data correctly.
   */
  test('should validate login form data correctly', async () => {
    render(
      <TestComponent setAccessToken={mockSetAccessToken} setUser={mockSetUser} isLoginSelected={true} />
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });

    fireEvent.submit(screen.getByTestId("test-form"));

    await waitFor(() => {
      expect(screen.getByText('Email and password are required.')).toBeInTheDocument();
    });

  });
  
  /**
   * Test case: handleSignIn should succeed and call setAccessToken and setUser.
   */
  test('handleSignIn should succeed and call setAccessToken and setUser', async () => {
    (postLogin as jest.Mock).mockResolvedValue({
      data: {
        accessToken: 'mockToken',
        user: { first_name: 'John', last_name: 'Doe', email: 'test@example.com', user_id: '123' },
      },
    });

    render(
      <TestComponent setAccessToken={mockSetAccessToken} setUser={mockSetUser} isLoginSelected={true} />
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.submit(screen.getByTestId("test-form"));

    await waitFor(() => {
      expect(postLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
      expect(mockSetAccessToken).toHaveBeenCalledWith('mockToken');
      expect(mockSetUser).toHaveBeenCalledWith({ first_name: 'John', last_name: 'Doe', email: 'test@example.com', user_id: '123' });
      expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    });
  });

  /**
   * Test case: should validate signup form data correctly.
   */
  test('should validate signup form data correctly', async () => {
    render(
      <TestComponent setAccessToken={mockSetAccessToken} setUser={mockSetUser} isLoginSelected={false} />
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.change(firstNameInput, { target: { value: '' } });
    fireEvent.change(lastNameInput, { target: { value: '' } });

    fireEvent.submit(screen.getByTestId("test-form"));

    await waitFor(() => {
      expect(screen.getByText('Email and password are required.')).toBeInTheDocument();
    });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.submit(screen.getByTestId("test-form"));

    await waitFor(() => {
      expect(screen.getByText('First name and last name are required for sign up.')).toBeInTheDocument();
    });

  });

  /**
   * Test case: handleSignUp should succeed and call handleSignIn.
   */
  test('handleSignUp should succeed and call handleSignIn', async () => {
    (postRegister as jest.Mock).mockResolvedValue({});
    (postLogin as jest.Mock).mockResolvedValue({
      data: {
        accessToken: 'mockToken',
        user: { first_name: 'John', last_name: 'Doe', email: 'test@example.com', user_id: '123' },
      },
    });

    render(
      <TestComponent setAccessToken={mockSetAccessToken} setUser={mockSetUser} isLoginSelected={false} />
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    fireEvent.submit(screen.getByTestId("test-form"));

    await waitFor(() => {
      expect(postRegister).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123', first_name: 'John', last_name: 'Doe' });
      expect(postLogin).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123', first_name: 'John', last_name: 'Doe' });
      expect(screen.queryByText('Registration failed')).not.toBeInTheDocument();
    });
  });

  /**
   * Test case: handleSignUp should set error on failure.
   */
  test('handleSignUp should set error on failure', async () => {
    (postRegister as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Registration failed' } },
    });

    render(
      <TestComponent setAccessToken={mockSetAccessToken} setUser={mockSetUser} isLoginSelected={false} />
    );

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const lastNameInput = screen.getByPlaceholderText('Last Name');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(firstNameInput, { target: { value: 'John' } });
    fireEvent.change(lastNameInput, { target: { value: 'Doe' } });

    fireEvent.submit(screen.getByTestId("test-form"));

    await waitFor(() => {
      expect(screen.getByText('Registration failed')).toBeInTheDocument();
    });
  });
});

