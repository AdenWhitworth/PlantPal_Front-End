import Button from '../Components/Button';
import InputField from '../Components/InputField';
import wifi from '../Images/wifi-brown.svg';
import lock from '../Images/lock-brown.svg';
import location from '../Images/location-brown.svg';
import tag from '../Images/tag-brown.svg';
import plus_circle from '../Images/plus-circle-gray.svg';
import "../App.css";
import React from 'react';

export default function AddDevice({}) {

    const handleButtonClick = () => {
        console.log("here");
    }

    return (
        <div className="new-device-section-2">
                    
            <div className='new-device-logo'>
                <img className="new-device-logo-img" src={plus_circle} alt="New device logo"></img>
                <h1 className="new-device-logo-txt">New Device</h1>
            </div>
            
            <InputField inputImg={location} isRequired={true} type='text' placeholder='Location' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField inputImg={tag} isRequired={true} type='text' placeholder='Asset Number' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField inputImg={wifi} isRequired={true} type='text' placeholder='Wifi SSID' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField inputImg={lock} isRequired={true} type='password' placeholder='Wifi Password' isSpellCheck={false} setWidth={'60%'}></InputField>
            
            <div className='new-device-section-2-btns'>
                <button className='text-btn hidden'><span>Change Password?</span></button>
                <Button children='Connect' onClick={handleButtonClick} isPrimaryStyle={false}></Button>
            </div>
        </div>
    );
}