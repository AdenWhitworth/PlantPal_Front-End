import SignUp from './SignUp';
import Login from './Login';
import React, { useState, useEffect } from 'react';
import {useAuth} from '../Provider/authProvider';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const client = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL
});
  
export default function UserAuthentication({setUser}) {

    const navigate = useNavigate();
    const { setToken } = useAuth();
    const [isCurrentUser, setIsCurrentUser] = useState(true);
    const [loginBtnStyle, setloginBtnStyle] = useState("userAuth-toggle-btn-selected");
    const [signUpBtnStyle, setSignUpBtnStyle] = useState("userAuth-toggle-btn");
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('Error');
    const [errorCSS, setErrorCSS] = useState('error-message hidden');

    const handleSignInClick = async (e) => {
        e.preventDefault();

        try {
            const response = await client.post("/users/login", { email: email, password: password });
            setErrorCSS('error-message hidden');
            setToken(response.data.token);
            setUser({
                firstName: response.data.user.first_name,
                lastName: response.data.user.last_name,
                email: response.data.user.email
            });
            
            navigate('/dashboard', {
                replace: true,
            });
            

        } catch (error) {
            setError(error.response.data.msg);
            setErrorCSS('error-message');
        }
    }

    const handleCreateClick = async (e) => {
        e.preventDefault();

        try {
            await client.post("/users/register", { email: email, password: password, first_name: firstName, last_name: lastName});
            try {
                const response = await client.post("/login", { email: email, password: password });
                setErrorCSS('error-message hidden');
                setToken(response.data.token);
                setUser({
                    firstName: response.data.user.first_name,
                    lastName: response.data.user.last_name,
                    email: response.data.user.email,
                    hashPassword: response.data.user.password
                });
                navigate('/dashboard', {
                    replace: true,
                });
            } catch (error) {
                setError('User created but failed to authorize. Try logging in.');
                setErrorCSS('error-message');
            }
        } catch (error) {
            setError(error.response.data.msg);
            setErrorCSS('error-message');
        }
    }

    const HandleReturnHome = () => {
        navigate('/', {
            replace: true,
        });
    }

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

    useEffect(() => {
        setErrorCSS('error-message hidden');
    }, []);

    return (
        <section className="userAuthentication">
            
            <div className="userAuth-sections">

                <div className="userAuth-section-1">
                    <div className='userAuth-selection'>
                        <button onClick={HandleLoginToggle} className={loginBtnStyle}><span>Login</span></button>
                        <button onClick={HandleSignUpToggle} className={signUpBtnStyle}><span>Sign Up</span></button>
                    </div>
                </div>

                {isCurrentUser? <Login HandleReturnHome={HandleReturnHome} handleSignInClick={handleSignInClick} error={error} errorCSS={errorCSS} setEmail={setEmail} setPassword={setPassword}></Login> : <SignUp handleCreateClick={handleCreateClick} HandleReturnHome={HandleReturnHome} error={error} errorCSS={errorCSS} setEmail={setEmail} setPassword={setPassword} setFirstName={setFirstName} setLastName={setLastName}></SignUp>}

            </div>

        </section>
    );
}