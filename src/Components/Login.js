import Button from '../Components/Button';
import InputField from '../Components/InputField';
import mail from '../Images/email-brown.svg';
import lock from '../Images/lock-brown.svg';
import plantpal_logo from '../Images/PlantPal Logo.svg';
import "../App.css";
import React from 'react';

export default function Login({setManageDevices, setUser}) {

    const handleSignInClick = () => {
        setUser(true);
        setManageDevices(false);
    }

    const HandleReturnHome = () => {
        setManageDevices(false);
    }

    return (
        <div className="userAuth-section-2">
                    
            <div className='userAuth-logo'>
                <img className="userAuth-logo-img grow" src={plantpal_logo} alt="PlantPal auth logo" onClick={HandleReturnHome}></img>
                <h1 className="userAuth-logo-txt">PlantPal</h1>
            </div>
            
            <InputField inputImg={mail} isRequired={true} type='email' placeholder='Email' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField inputImg={lock} isRequired={true} type='password' placeholder='Password' isSpellCheck={false} setWidth={'60%'}></InputField>
            
            <div className='userAuth-section-2-btns'>
                <button className='text-btn'><span>Forgot Password?</span></button>
                <Button children='Sign In' onClick={handleSignInClick} isPrimaryStyle={false} ></Button>
            </div>
        </div>
    );
}