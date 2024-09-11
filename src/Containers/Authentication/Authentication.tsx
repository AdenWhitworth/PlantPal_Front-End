import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvider';
import { useSocket } from '../../Provider/SocketProvider';
import AuthSelection from './AuthSelection';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import './Athentication.css';
import { useAuthHandlers } from '../../Hooks/useAuthHandlers';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function UserAuthentication() {
  const navigate = useNavigate();
  const { setAccessToken, setUser, accessToken } = useAuth();
  const { connectSocket, isConnected } = useSocket();
  const [isLoginSelected, setIsLoginSelected] = useState(true);
  const { handleSignIn, handleSignUp, error, isLoading, resetError } = useAuthHandlers({ setAccessToken, setUser, isLoginSelected });
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const hasNavigated = useRef(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReturnHome = () => {
    navigate('/', { replace: true });
  };

  const handleReturnForgotPassword = () => {
    navigate('/forgotPassword', { replace: true });
  };

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSignIn(e, {
      email: formData.email,
      password: formData.password,
    }, (passedToken: string) => {
      connectSocket(passedToken);  
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSignUp(e, {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
    }, (passedToken: string) => {
      connectSocket(passedToken); 
    });
  };

  useEffect(() => {
    resetError();
  }, [isLoginSelected]);

  useEffect(() => {
    if(accessToken && isConnected && !hasNavigated.current) {
      navigate('/dashboard', { replace: true });
      hasNavigated.current = true;
    }
  }, [accessToken, isConnected])

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
