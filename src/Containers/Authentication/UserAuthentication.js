import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Provider/AuthProvider';
import { useSocket } from '../../Provider/SocketProvider';
import AuthSelection from './AuthSelection';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import '../../App.css';
import { useAuthHandlers } from '../../Hooks/useAuthHandlers';

export default function UserAuthentication() {
  const navigate = useNavigate();
  const { setToken, setUser } = useAuth();
  const { connectSocket } = useSocket();
  const [isLoginSelected, setIsLoginSelected] = useState(true);
  const { handleSignIn, handleSignUp, error, isLoading, resetError } = useAuthHandlers({ setToken, setUser, isLoginSelected });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleReturnHome = () => {
    navigate('/', { replace: true });
  };

  const handleLoginSubmit = (e) => {
    handleSignIn(e, {
      email: formData.email,
      password: formData.password,
    }, (token) => {
      connectSocket(token);
      navigate('/dashboard', { replace: true });
    });
  };

  const handleSignUpSubmit = (e) => {
    handleSignUp(e, {
      email: formData.email,
      password: formData.password,
      first_name: formData.firstName,
      last_name: formData.lastName,
    }, (token) => {
      connectSocket(token);
      navigate('/dashboard', { replace: true });
    });
  };

  useEffect(() => {
    resetError();
  }, [isLoginSelected]);

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
