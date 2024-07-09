import Button from '../Components/Button';
import InputField from '../Components/InputField';
import mail from '../Images/email-brown.svg';
import lock from '../Images/lock-brown.svg';
import user_circle from '../Images/user-circle-brown.svg';
import tag from '../Images/tag-brown.svg';
import plantpal_logo from '../Images/PlantPal Logo.svg';
import "../App.css";
import React from 'react';

export default function SignUp({handleCreateClick, HandleReturnHome, setEmail, setPassword, setFirstName, setLastName}) {

    return (
        <form className="userAuth-section-2" onSubmit={handleCreateClick}>
                    
            <div className='userAuth-logo'>
                <img className="userAuth-logo-img grow" src={plantpal_logo} alt="PlantPal auth logo" onClick={HandleReturnHome}></img>
                <h1 className="userAuth-logo-txt">PlantPal</h1>
            </div>
            
            <InputField onChange={(e) => setFirstName(e.target.value)} inputImg={user_circle} isRequired={true} type='text' placeholder='First Name' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField onChange={(e) => setLastName(e.target.value)} inputImg={tag} isRequired={true} type='text' placeholder='Last Name' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField onChange={(e) => setEmail(e.target.value)} inputImg={mail} isRequired={true} type='email' placeholder='Email' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField onChange={(e) => setPassword(e.target.value)} inputImg={lock} isRequired={true} type='password' placeholder='Password' isSpellCheck={false} setWidth={'60%'}></InputField>
            
            <div className='userAuth-section-2-btns'>
                <button className='text-btn hidden'><span>Forgot Password?</span></button>
                <Button children='Create' type='submit' isPrimaryStyle={false} ></Button>
            </div>
        </form>
    );
}