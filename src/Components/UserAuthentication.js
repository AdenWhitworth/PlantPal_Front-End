import SignUp from './SignUp';
import Login from './Login';
import React, { useState, useEffect } from 'react';
import {useAuth} from '../Provider/authProvider';
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const client = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});
  
export default function UserAuthentication({setManageDevices, setUser}) {

    const navigate = useNavigate();
    const { state } = useLocation();
    const { setToken } = useAuth();
    const from = state?.from || { pathname: '/' };
    const [redirectToReferrer, setRedirectToReferrer] = useState(false);

    const [isCurrentUser, setIsCurrentUser] = useState(true);
    const [loginBtnStyle, setloginBtnStyle] = useState("userAuth-toggle-btn-selected");
    const [signUpBtnStyle, setSignUpBtnStyle] = useState("userAuth-toggle-btn");
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('Error');
    const [errorCSS, setErrorCSS] = useState('error-message hidden');

    const handleSignInClick = async (e) => {
        e.preventDefault();

        try {
            const response = await client.post("/login", { email: email, password: password });
            console.log("Sign in successful", response.data.msg, response.data.user);
            setErrorCSS('error-message hidden');
            setToken(response.data.token);
            setRedirectToReferrer(true);
        } catch (error) {
            setError(error.response.data.msg);
            setErrorCSS('error-message');
        }
    }

    const handleCreateClick = () => {
        
        //setToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzIwMDE4MjQ4LCJleHAiOjE3MjAwMjE4NDh9.WasiMQ7MqvqLHSqC6GkdL_Pgj6jzXVzp4HeR-S16jIY");
        //ssetRedirectToReferrer(true);

        /*
        fakeAuth.authenticate(() => {
            setRedirectToReferrer(true);
        });
        */
    }

    const HandleReturnHome = () => {
        navigate('/', {
            replace: true,
        });
    }

    useEffect(() => {
        if (redirectToReferrer) {
            navigate(from.pathname, { replace: true });
        }
    }, [redirectToReferrer, navigate, from.pathname]);

    useEffect(() => {
        setErrorCSS('error-message hidden');
    }, []);

    const HandleLoginToggle = () => {
        setIsCurrentUser(true);
        setloginBtnStyle("userAuth-toggle-btn-selected");
        setSignUpBtnStyle("userAuth-toggle-btn");
    }

    const HandleSignUpToggle = () => {
        setIsCurrentUser(false);
        setloginBtnStyle("userAuth-toggle-btn");
        setSignUpBtnStyle("userAuth-toggle-btn-selected");
    }

    return (
        <section className="userAuthentication">
            
            <div className="userAuth-sections">

                <div className="userAuth-section-1">
                    <div className='userAuth-selection'>
                        <button onClick={HandleLoginToggle} className={loginBtnStyle}><span>Login</span></button>
                        <button onClick={HandleSignUpToggle} className={signUpBtnStyle}><span>Sign Up</span></button>
                    </div>
                </div>

                {isCurrentUser? <Login HandleReturnHome={HandleReturnHome} handleSignInClick={handleSignInClick} error={error} errorCSS={errorCSS} setEmail={setEmail} setPassword={setPassword}></Login> : <SignUp handleCreateClick={handleCreateClick} HandleReturnHome={HandleReturnHome}></SignUp>}

            </div>

        </section>
    );
}

export const fakeAuth = {
    isAuthenticated: false,
    authenticate(cb) {
        this.isAuthenticated = true;
        setTimeout(cb, 100);
    },
};