import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { useAuth } from './Provider/AuthProvider/AuthProvider';

jest.mock('./Containers/Landing/Landing', () => () => <div>Landing Page</div>);
jest.mock('./Containers/Authentication/Authentication', () => () => <div>Authentication</div>);
jest.mock('./Containers/Dashboard/Dashboard', () => () => <div>Dashboard</div>);
jest.mock('./Containers/Authentication/ForgotPassword/ForgotPassword', () => () => <div>Forgot Password</div>);
jest.mock('./Containers/Authentication/ResetPassword/ResetPassword', () => () => <div>Reset Password</div>);

jest.mock('./Provider/AuthProvider/AuthProvider', () => ({
    useAuth: jest.fn(),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('./Provider/SocketProvider/SocketProvider', () => ({
    SocketProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
jest.mock('./Provider/DeviceProvider/DeviceProvider', () => ({
    DeviceProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

/**
 * Test suite for the `App` component, focusing on routing behavior.
 */
describe('App Routing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /**
   * Verifies that the `Landing` page is rendered on the root route `/`.
   */
  test('renders Landing page on the "/" route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Landing Page')).toBeInTheDocument();
  });

  /**
   * Verifies that the `Authentication` page is rendered on the `/auth` route.
   */
  test('renders Authentication on the "/auth" route', () => {
    render(
      <MemoryRouter initialEntries={['/auth']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Authentication')).toBeInTheDocument();
  });
  
  /**
   * Verifies that the `Forgot Password` page is rendered on the `/forgotPassword` route.
   */
  test('renders Forgot Password on the "/forgotPassword" route', () => {
    render(
      <MemoryRouter initialEntries={['/forgotPassword']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
  });

  /**
   * Verifies that the `Reset Password` page is rendered on the `/resetPassword` route.
   */
  test('renders Reset Password on the "/resetPassword" route', () => {
    render(
      <MemoryRouter initialEntries={['/resetPassword']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Reset Password')).toBeInTheDocument();
  });
  
  /**
   * Verifies that the `Dashboard` page is rendered on the `/dashboard` route
   * if the user is authenticated (i.e., `accessToken` is present).
   */
  test('renders Dashboard on the "/dashboard" route if authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ 
        user: { user_id: 1 }, 
        accessToken: 'token123' 
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
  
  /**
   * Verifies that unauthenticated users are redirected to the `Authentication` page
   * when trying to access the `/dashboard` route.
   */
  test('redirects to authentication on "/dashboard" route if not authenticated', () => {
    (useAuth as jest.Mock).mockReturnValue({ 
        user: null, 
        accessToken: null 
    });

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText('Authentication')).toBeInTheDocument();
  });
});
