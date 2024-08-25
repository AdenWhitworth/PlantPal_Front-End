import React from 'react';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import mail from '../../Images/email-brown.svg';
import lock from '../../Images/lock-brown.svg';
import user_circle from '../../Images/user-circle-brown.svg';
import tag from '../../Images/tag-brown.svg';
import plantpal_logo from '../../Images/PlantPal Logo.svg';
import "../../App.css";

export default function SignUpForm({
    handleReturnHome, 
    error,
    handleInputChange,
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
                name='firstName'
                inputImg={user_circle} 
                isRequired={true} 
                type='text' 
                placeholder='First Name' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

            <InputField 
                onChange={handleInputChange} 
                name='lastName'
                inputImg={tag} 
                isRequired={true} 
                type='text' 
                placeholder='Last Name' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

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
                <Button styleType='tertiary' className='hidden' onClick={() => console.log("click")}>Forgot Password?</Button>
                <Button type="submit" disabled={isLoading} styleType='secondary'>
                    {isLoading ? 'Creating...' : 'Create'}
                </Button>
            </div>

            {error && <div className="error-message">{error}</div>}
        </form>
    );
}