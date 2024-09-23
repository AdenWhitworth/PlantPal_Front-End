import React from 'react';
import { render, screen } from '@testing-library/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../Provider/AuthProvider/AuthProvider';
import PrivateRoute from './PrivateRoute';

//Mocking the react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

//Mocking the AuthProvider
jest.mock('../Provider/AuthProvider/AuthProvider', () => ({
  useAuth: jest.fn(),
}));

/**
 * Tests for the PrivateRoute component.
 */
describe('PrivateRoute', () => {
  const mockNavigate = jest.fn();
  const mockLocation = { pathname: '/dashboard' };
  const ChildComponent = () => <div>Protected Component</div>;

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
  });

  /**
   * Test that verifies redirection to the /auth page when accessToken is not available.
   */
  test('redirects to /auth when accessToken is not available', () => {
    (useAuth as jest.Mock).mockReturnValue({ accessToken: null });

    render(
      <PrivateRoute>
        <ChildComponent />
      </PrivateRoute>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/auth', {
      state: { from: mockLocation },
      replace: true,
    });
    expect(screen.queryByText('Protected Component')).not.toBeInTheDocument();
  });

  /**
   * Test that verifies the child component is rendered when accessToken is available.
   */
  test('renders the child component when accessToken is available', () => {
    (useAuth as jest.Mock).mockReturnValue({ accessToken: 'token123' });

    render(
      <PrivateRoute>
        <ChildComponent />
      </PrivateRoute>
    );

    expect(screen.getByText('Protected Component')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  /**
   * Test that verifies no navigation occurs if accessToken is present.
   */
  test('does not call navigate if accessToken is present', () => {
    (useAuth as jest.Mock).mockReturnValue({ accessToken: 'valid-token' });

    render(
      <PrivateRoute>
        <ChildComponent />
      </PrivateRoute>
    );

    expect(screen.getByText('Protected Component')).toBeInTheDocument();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
