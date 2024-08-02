import SignUp from './SignUp';
import Login from './Login';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../Provider/authProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../Provider/SocketProvider';

const client = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export default function UserAuthentication() {
  const navigate = useNavigate();
  const { setToken, setUser, user } = useAuth();
  const [isCurrentUser, setIsCurrentUser] = useState(true);
  const [loginBtnStyle, setLoginBtnStyle] = useState('userAuth-toggle-btn-selected');
  const [signUpBtnStyle, setSignUpBtnStyle] = useState('userAuth-toggle-btn');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('Error');
  const [errorCSS, setErrorCSS] = useState('error-message hidden');
  const { sendAddUser, isConnected, connectSocket } = useSocket();

  const handleSignInClick = async (e) => {
    e.preventDefault();

    try {
      const response = await client.post('/users/login', { email, password });
      setErrorCSS('error-message hidden');
      setToken(response.data.token);
      setUser({
        firstName: response.data.user.first_name,
        lastName: response.data.user.last_name,
        email: response.data.user.email,
        user_id: response.data.user.user_id,
      });

      connectSocket(response.data.token);

      
    } catch (error) {
      setError(error.response.data.message);
      setErrorCSS('error-message');
    }
  };

  useEffect(() => {
    try {
      if (isConnected && user) {
        console.log("here", isConnected, user)
        sendAddUser(user.user_id);
        navigate('/dashboard', {
          replace: true,
        });
      } 
    } catch (error) {
      console.log(error);
    }
    
  }, [isConnected, user]);

  const handleCreateClick = async (e) => {
    e.preventDefault();

    try {
      await client.post('/users/register', {
        email,
        password,
        first_name: firstName,
        last_name: lastName,
      });
      try {
        const response = await client.post('/users/login', { email, password });
        setErrorCSS('error-message hidden');
        setToken(response.data.token);
        setUser({
          firstName: response.data.user.first_name,
          lastName: response.data.user.last_name,
          email: response.data.user.email,
          user_id: response.data.user.user_id,
        });

        connectSocket(response.data.token);

      } catch (error) {
        setError('User created but failed to authorize. Try logging in.');
        setErrorCSS('error-message');
      }
    } catch (error) {
      setError(error.response.data.message);
      setErrorCSS('error-message');
    }
  };

  const HandleReturnHome = () => {
    navigate('/', {
      replace: true,
    });
  };

  const HandleLoginToggle = () => {
    setIsCurrentUser(true);
    setLoginBtnStyle('userAuth-toggle-btn-selected');
    setSignUpBtnStyle('userAuth-toggle-btn');
  };

  const HandleSignUpToggle = () => {
    setIsCurrentUser(false);
    setLoginBtnStyle('userAuth-toggle-btn');
    setSignUpBtnStyle('userAuth-toggle-btn-selected');
  };

  useEffect(() => {
    setErrorCSS('error-message hidden');
  }, [isCurrentUser]);

  return (
    <section className="userAuthentication">
      <div className="userAuth-sections">
        <div className="userAuth-section-1">
          <div className="userAuth-selection">
            <button onClick={HandleLoginToggle} className={loginBtnStyle}>
              <span>Login</span>
            </button>
            <button onClick={HandleSignUpToggle} className={signUpBtnStyle}>
              <span>Sign Up</span>
            </button>
          </div>
        </div>
        {isCurrentUser ? (
          <Login
            HandleReturnHome={HandleReturnHome}
            handleSignInClick={handleSignInClick}
            error={error}
            errorCSS={errorCSS}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        ) : (
          <SignUp
            handleCreateClick={handleCreateClick}
            HandleReturnHome={HandleReturnHome}
            error={error}
            errorCSS={errorCSS}
            setEmail={setEmail}
            setPassword={setPassword}
            setFirstName={setFirstName}
            setLastName={setLastName}
          />
        )}
      </div>
    </section>
  );
}
