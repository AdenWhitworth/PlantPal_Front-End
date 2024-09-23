import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useAuth, AuthProvider } from './AuthProvider';
import axios from 'axios';

//Mocking the axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

/**
 * Tests the functionality of the AuthProvider component.
 */
describe('AuthProvider', () => {
  /**
   * Test component to interact with the AuthProvider.
   * 
   * @returns {JSX.Element} The rendered TestComponent.
   */
  const TestComponent = (): JSX.Element => {
    const { accessToken, setAccessToken, clearAccessToken, user, setUser, clearUser } = useAuth();
    
    return (
      <div>
        <div>Access Token: {accessToken? accessToken : "null"}</div>
        <div>User: {user ? JSON.stringify(user) : 'null'}</div>
        <button onClick={() => setAccessToken('new-token')}>Set Token</button>
        <button onClick={clearAccessToken}>Clear Token</button>
        <button onClick={() => setUser({ first_name: 'John', last_name: 'Doe', email: 'john@example.com', user_id: '123' })}>Set User</button>
        <button onClick={clearUser}>Clear User</button>
      </div>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    mockAxios.defaults.headers.common = {};
    jest.clearAllMocks();
  });

  /**
   * Tests that the AuthProvider initializes with values from localStorage.
   */
  test('initializes with values from localStorage', async () => {
    const { rerender } = render(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );

    expect(screen.getByText('Access Token: null')).toBeInTheDocument();
    expect(screen.getByText('User: null')).toBeInTheDocument();

    screen.getByText('Set Token').click();
    screen.getByText('Set User').click();

    rerender(
        <AuthProvider>
            <TestComponent />
        </AuthProvider>
    );
    
    expect(screen.getByText('Access Token: new-token')).toBeInTheDocument();
    expect(screen.getByText('User: {"first_name":"John","last_name":"Doe","email":"john@example.com","user_id":"123"}')).toBeInTheDocument();
  });

  /**
   * Tests that the access token can be set and that axios headers are updated accordingly.
   */
  test('sets the access token and updates axios headers', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Set Token').click();
    });

    expect(screen.getByText('Access Token: new-token')).toBeInTheDocument();
    expect(localStorage.getItem('accessToken')).toBe('new-token');
    expect(mockAxios.defaults.headers.common['Authorization']).toBe('Bearer new-token');
  });

  /**
   * Tests that the access token can be cleared and that axios headers are removed.
   */
  test('clears the access token and removes axios headers', () => {
    localStorage.setItem('accessToken', 'stored-token');
    mockAxios.defaults.headers.common['Authorization'] = 'Bearer stored-token';

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Clear Token').click();
    });

    expect(screen.getByText('Access Token: null')).toBeInTheDocument();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(mockAxios.defaults.headers.common['Authorization']).toBeUndefined();
  });

  /**
   * Tests that the user can be set and cleared in localStorage.
   */
  test('sets and clears the user in localStorage', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    act(() => {
      screen.getByText('Set User').click();
    });

    expect(screen.getByText('User: {"first_name":"John","last_name":"Doe","email":"john@example.com","user_id":"123"}')).toBeInTheDocument();
    expect(localStorage.getItem('user')).toBe('{"first_name":"John","last_name":"Doe","email":"john@example.com","user_id":"123"}');

    act(() => {
      screen.getByText('Clear User').click();
    });

    expect(screen.getByText('User: null')).toBeInTheDocument();
    expect(localStorage.getItem('user')).toBeNull();
  });

  /**
   * Tests that an error is thrown when useAuth is used outside of AuthProvider.
   */
  test('throws an error when useAuth is used outside of AuthProvider', () => {
    const TestErrorComponent = () => {
      useAuth();
      return <div>Test</div>;
    };
  
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    expect(() => render(<TestErrorComponent />)).toThrow('useAuth must be used within an AuthProvider');
  
    consoleErrorSpy.mockRestore();
  });
});

   
