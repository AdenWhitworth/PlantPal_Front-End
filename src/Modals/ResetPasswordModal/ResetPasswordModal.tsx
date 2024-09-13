import React from "react";
import lock from '../Images/lock-brown.svg';
import Button from '../../Components/Button/Button';
import InputField from '../../Components/InputField/InputField';
import Modal from '../../Components/Modal/Modal';
import './ResetPasswordModal.css';

interface ResetPasswordModalProps {
    handleReturnHome: () => void;
    message: string | null;
    error: string | null;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function ResetPasswordModal ({ 
    handleReturnHome, 
    message,
    error,
    handleInputChange,
    handleSubmit,
}: ResetPasswordModalProps) {
    return(
        <Modal 
            addClose={true} 
            addButton={false}
            buttonLabel='Accept'
            styleType='primary'
            children={
                <form className='password-form' onSubmit={handleSubmit} data-testid="reset-form">

                    <h1 className="password-form-logo-txt" data-testid="reset-password-title">Reset Password</h1>

                    <InputField
                        onChange={handleInputChange} 
                        name='password'
                        inputImg={lock} 
                        isRequired={true} 
                        type='password' 
                        placeholder='New Password' 
                        isSpellCheck={false} 
                        setWidth={'100%'}
                    ></InputField>

                    <InputField
                        onChange={handleInputChange} 
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
                        <Button type="submit" styleType='secondary' testId="reset-password-btn">Reset Password</Button>
                    </div>
                    
                    {message && <h4>{message}</h4>}
                    
                    {error && <div className="error-message">{error}</div>}
                </form>
            }
            handleCloseClick={handleReturnHome}
        ></Modal>
    );
}