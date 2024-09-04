import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvider';
import { useSocket } from '../../Provider/SocketProvider';
import AuthSelection from './AuthSelection';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import '../../App.css';
import { useAuthHandlers } from '../../Hooks/useAuthHandlers';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function UserAuthentication() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const { connectSocket } = useSocket();
  const [isLoginSelected, setIsLoginSelected] = useState(true);
  const { handleSignIn, handleSignUp, error, isLoading, resetError } = useAuthHandlers({ setAccessToken, setUser, isLoginSelected });
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

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
    }, (accessToken: string) => {
        connectSocket(accessToken);
        navigate('/dashboard', { replace: true });
    });
  };

  const handleSignUpSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSignUp(e, {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
    }, (accessToken: string) => {
      connectSocket(accessToken);
      navigate('/dashboard', { replace: true });
    });
  };

  useEffect(() => {
    resetError();
  }, [isLoginSelected, resetError]);

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
