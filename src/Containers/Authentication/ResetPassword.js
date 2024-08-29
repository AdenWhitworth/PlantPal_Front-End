import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import lock from '../../Images/lock-brown.svg';
import plantpal_logo from '../../Images/PlantPal Logo.svg';
import { postResetPassword } from '../../Services/ApiService';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import Modal from '../../Components/Modal';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('resetToken');
    const userId = searchParams.get('user_id');

    const resetError = () => setError(null);
    const resetMessage = () => setMessage(null);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        resetError();
        resetMessage();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            await postResetPassword({
                password,
                resetToken: encodeURIComponent(resetToken),
                user_id: userId,
            });

            setMessage('Success resetting the password. Please log in with the new credentials.')

            handleReturnAuth();
        } catch (err) {
            setError('Error resetting password. Please try again.');
        }
    };

    const handleReturnHome = () => {
        navigate('/', { replace: true });
    };

    const handleReturnAuth = () => {
        navigate('/auth', { replace: true })  
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
                <form className='password-form' onSubmit={handleResetPassword}>

                    <h1 className="password-form-logo-txt">Reset Password</h1>

                    <InputField
                        onChange={(e) => setPassword(e.target.value)} 
                        name='password'
                        inputImg={lock} 
                        isRequired={true} 
                        type='password' 
                        placeholder='New Password' 
                        isSpellCheck={false} 
                        setWidth={'100%'}
                    ></InputField>

                    <InputField
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        name='confirmPassword'
                        inputImg={lock} 
                        isRequired={true} 
                        type='password' 
                        placeholder='Confirm Password' 
                        isSpellCheck={false} 
                        setWidth={'100%'}
                    ></InputField>

                    <div className='password-form-logo-btns'>
                        <div></div>
                        <Button type="submit" styleType='secondary'>Reset Password</Button>
                    </div>
                    
                    {message && <h4>{message}</h4>}
                    
                    {error && <div className="error-message">{error}</div>}
                </form>
            }
            handleCloseClick={handleReturnHome}
        ></Modal>
    );
};

export default ResetPassword;
