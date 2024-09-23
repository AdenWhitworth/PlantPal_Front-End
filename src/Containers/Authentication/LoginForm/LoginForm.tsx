import React from 'react';
import Button from '../../../Components/Button/Button';
import InputField from '../../../Components/InputField/InputField';
import mail from '../../../Images/email-brown.svg';
import lock from '../../../Images/lock-brown.svg';
import plantpal_logo from '../../../Images/PlantPal Logo.svg';
import { LoginFormProps } from './LoginFormTypes';

/**
 * LoginForm component responsible for rendering the login form.
 * 
 * @param {function} handleReturnHome - Function to navigate back to the home page.
 * @param {function} handleReturnForgotPassword - Function to navigate to the forgot password page.
 * @param {function} handleInputChange - Function to handle changes in input fields.
 * @param {string | null} error - Error message to display when login fails.
 * @param {function} handleSubmit - Function to handle form submission.
 * @param {boolean} isLoading - Whether the form is currently in a loading state.
 * 
 * @returns {JSX.Element} The rendered login form component.
 */
export default function LoginForm({ 
    handleReturnHome, 
    handleReturnForgotPassword,
    handleInputChange,
    error,
    handleSubmit,
    isLoading
}: LoginFormProps) {

    return (
        
        <form className="userAuth-section-2" onSubmit={handleSubmit} data-testid="login-form">
            <div className='userAuth-logo'>
                <img 
                    className="userAuth-logo-img grow" 
                    src={plantpal_logo} 
                    alt="PlantPal auth logo" 
                    onClick={handleReturnHome}
                ></img>
                <h1 className="userAuth-logo-txt">PlantPal</h1>
            </div>
            
            <InputField
                onChange={handleInputChange} 
                name='email'
                inputImg={mail} 
                isRequired={true} 
                type='email' 
                placeholder='Email' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

            <InputField
                onChange={handleInputChange} 
                name='password'
                inputImg={lock} 
                isRequired={true} 
                type='password' 
                placeholder='Password' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>
            
            <div className='userAuth-section-2-btns'>
                <Button styleType='tertiary' onClick={handleReturnForgotPassword}>Forgot Password?</Button>
                <Button type="submit" disabled={isLoading} styleType='secondary'>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
            </div>

            {error && <div className="error-message">{error}</div>}
        </form>  
        
    );
}