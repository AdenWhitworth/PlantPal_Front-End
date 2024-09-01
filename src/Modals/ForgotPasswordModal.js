import React from "react";
import mail from '../Images/email-brown.svg';
import Button from '../Components/Button';
import InputField from '../Components/InputField';
import Modal from '../Components/Modal';

export default function ForgotPasswordModal ({ 
    handleReturnHome, 
    message,
    error,
    handleInputChange,
    handleSubmit,
}) {
    return(
        <Modal 
            addClose={true} 
            addButton={false}
            buttonLabel='Accept'
            styleType='primary'
            children={
                <form className='password-form' onSubmit={handleSubmit}>
                    <h1 className="password-form-logo-txt">Reset Password</h1>

                    <p>Enter the email associated with your account and we'll send an email with instructions to reset your password.</p>
                    
                    <InputField 
                        onChange={handleInputChange} 
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
}