import Button from '../Components/Button';
import InputField from '../Components/InputField';
import mail from '../Images/email-brown.svg';
import lock from '../Images/lock-brown.svg';
import user_circle from '../Images/user-circle-brown.svg';
import tag from '../Images/tag-brown.svg';
import gear from '../Images/gear-grey.svg';
import "../App.css";
import React from 'react';

export default function Account() {

    const handleButtonClick = () => {
        console.log("here");
    }

    return (
        <div className="account-section-2">
                    
            <div className='account-logo'>
                <img className="account-logo-img" src={gear} alt="Account logo"></img>
                <h1 className="account-logo-txt">Account</h1>
            </div>
            
            <InputField inputImg={user_circle} isRequired={true} type='text' placeholder='First Name' isSpellCheck={false} setWidth={'60%'} isDisabled={true}></InputField>
            <InputField inputImg={tag} isRequired={true} type='text' placeholder='Last Name' isSpellCheck={false} setWidth={'60%'} isDisabled={true}></InputField>
            <InputField inputImg={mail} isRequired={true} type='email' placeholder='Email' isSpellCheck={false} setWidth={'60%'} isDisabled={true}></InputField>
            <InputField inputImg={lock} isRequired={true} type='password' placeholder='Password' isSpellCheck={false} setWidth={'60%'}></InputField>
            
            <div className='account-section-2-btns'>
                <button className='text-btn'><span>Change Password?</span></button>
                <Button children='Edit' onClick={handleButtonClick} isPrimaryStyle={false}></Button>
            </div>
        </div>
    );
}