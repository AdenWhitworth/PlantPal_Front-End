import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { useAuth, AuthProvider } from './AuthProvider';
import axios from 'axios';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('AuthProvider', () => {
  const TestComponent = () => {
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

   
