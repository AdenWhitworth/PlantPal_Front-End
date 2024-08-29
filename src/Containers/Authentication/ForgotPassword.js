import React, { useState, useEffect } from 'react';
import { postForgotPassword } from '../../Services/ApiService';
import { useNavigate } from 'react-router-dom';
import mail from '../../Images/email-brown.svg';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import Modal from '../../Components/Modal';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const resetError = () => setError(null);
    const resetMessage = () => setMessage(null);

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        resetError();
        resetMessage();
        try {
            await postForgotPassword({
                email
            });

            setMessage('We have sent password recover instructions to your email.')

        } catch (err) {
            setError('Error sending password reset email');
        }
    };

    const handleReturnHome = () => {
        navigate('/', { replace: true });
    };

    useEffect(() => {
        resetError();
        resetMessage();
    },[]);

    return (

        <Modal 
            addClose={true} 
            addButton={false}
            buttonLabel='Accept'
            styleType='primary'
            children={
                <form className='password-form' onSubmit={handleForgotPassword}>
                    <h1 className="password-form-logo-txt">Reset Password</h1>

                    <p>Enter the email associated with your account and we'll send an email with instructions to reset your password.</p>
                    
                    <InputField 
                        onChange={(e) => setEmail(e.target.value)} 
                        name='email'
                        inputImg={mail} 
                        isRequired={true} 
                        type='email' 
                        placeholder='Email' 
                        isSpellCheck={false} 
                        setWidth={'100%'}
                    ></InputField>

                    <div className='password-form-logo-btns'>
                        <div></div>
                        <Button type="submit" styleType='secondary'>Send Instructions</Button>
                    </div>
                    
                    {message && <h4>{message}</h4>}
                    
                    {error && <div className="error-message">{error}</div>}
                </form>
            }
            handleCloseClick={handleReturnHome}
        ></Modal>
    );
};

export default ForgotPassword;
