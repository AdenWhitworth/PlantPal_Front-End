import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvider/AuthProvider';
import { useSocket } from '../../Provider/SocketProvider/SocketProvider';
import AuthSelection from './AuthSelection/AuthSelection';
import LoginForm from './LoginForm/LoginForm';
import SignUpForm from './SignUpForm/SignUpForm';
import './Athentication.css';
import { useAuthHandlers } from '../../Hooks/useAuthHandlers';
import { FormData } from './AthenticationTypes';

/**
 * The Authentication component is responsible for rendering
 * the authentication flow, including login and sign-up forms.
 * It manages the user input, form submissions, and handles
 * redirection based on authentication state.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */
export default function Authentication(): JSX.Element {
  const navigate = useNavigate();
  const { setAccessToken, setUser, accessToken } = useAuth();
  const { connectSocket, isConnected } = useSocket();
  const [isLoginSelected, setIsLoginSelected] = useState<boolean>(true);
  const { handleSignIn, handleSignUp, error, isLoading, resetError } = useAuthHandlers({ setAccessToken, setUser, isLoginSelected });
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const hasNavigated = useRef(false);

  /**
   * Handles input changes for the login or sign-up form.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event for the input fields.
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Navigates back to the home page.
   */
  const handleReturnHome = () => {
    navigate('/', { replace: true });
  };

  /**
   * Navigates to the forgot password page.
   */
  const handleReturnForgotPassword = () => {
    navigate('/forgotPassword', { replace: true });
  };

  /**
   * Handles form submission for login.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSignIn(e, {
      email: formData.email || '',
      password: formData.password || '',
    }, (passedToken: string) => {
      connectSocket(passedToken);  
    });
  };

  /**
   * Handles form submission for sign-up.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSignUp(e, {
      email: formData.email || '',
      password: formData.password || '',
      first_name: formData.firstName,
      last_name: formData.lastName,
    }, (passedToken: string) => {
      connectSocket(passedToken); 
    });
  };

  /**
   * Resets any authentication-related errors when switching between login and sign-up modes.
   */
  useEffect(() => {
    resetError();
  }, [isLoginSelected, resetError]);

  /**
   * Redirects the user to the dashboard once authenticated and the socket is connected.
   */
  useEffect(() => {
    if(accessToken && isConnected && !hasNavigated.current) {
      navigate('/dashboard', { replace: true });
      hasNavigated.current = true;
    }
  }, [accessToken, isConnected, navigate])

  return (
    <section className="userAuthentication">
      <div className="userAuth-sections">
        
        <AuthSelection
          isLoginSelected={isLoginSelected}
          setIsLoginSelected={setIsLoginSelected}
        />

        {isLoginSelected ? (
          <LoginForm
            handleInputChange={handleInputChange}
            handleSubmit={handleLoginSubmit}
            handleReturnHome={handleReturnHome}
            handleReturnForgotPassword={handleReturnForgotPassword}
            error={error}
            isLoading={isLoading}
          />
        ) : (
          <SignUpForm
            handleInputChange={handleInputChange}
            handleSubmit={handleSignUpSubmit}
            handleReturnHome={handleReturnHome}
            error={error}
            isLoading={isLoading}
          />
        )}
      </div>
    </section>
  );
}
