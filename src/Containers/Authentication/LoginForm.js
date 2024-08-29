import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import mail from '../../Images/email-brown.svg';
import lock from '../../Images/lock-brown.svg';
import plantpal_logo from '../../Images/PlantPal Logo.svg';
import "../../App.css";
import React from 'react';

export default function LoginForm({ 
    handleReturnHome, 
    handleReturnForgotPassword,
    handleInputChange,
    error,
    handleSubmit,
    isLoading
}) {

    return (
        
        <form className="userAuth-section-2" onSubmit={handleSubmit}>
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