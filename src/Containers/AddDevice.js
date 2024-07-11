import Button from '../Components/Button';
import InputField from '../Components/InputField';
import wifi from '../Images/wifi-brown.svg';
import lock from '../Images/lock-brown.svg';
import location from '../Images/location-brown.svg';
import tag from '../Images/tag-brown.svg';
import plus_circle from '../Images/plus-circle-gray.svg';
import "../App.css";
import React, {useState} from 'react';
import {useAuth} from '../Provider/authProvider';
import axios from "axios";

export default function AddDevice({setConnectDeviceToggle, setSettingsToggle, setAddDeviceToggle, handleRefreshClick, setDevice}) {

    const [deviceLocation, setDeviceLocation] = useState('');
    const [assetNumber, setAssetNumber] = useState('');
    const [wifiSSID, setWifiSSID] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [error, setError] = useState('Error');
    const [errorCSS, setErrorCSS] = useState('error-message hidden');

    const { token } = useAuth();

    const client = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        
        headers: {
            "Authorization": "Bearer " + token
        }
        
    });

    const handleConnectClick = async (e) => {
        e.preventDefault();
        
        try {
            const newDevice = await client.post("/dashboard/addDevice", { location: deviceLocation, cat_num: assetNumber, wifi_ssid: wifiSSID, wifi_password: wifiPassword });
            
            setDevice(newDevice.data.newDevice);
            setErrorCSS('error-message hidden');
            document.getElementById("new-device").reset();
            setConnectDeviceToggle(true);
            setAddDeviceToggle(false);
            setSettingsToggle(false);
            

        } catch (error) {
            setError(error.response.data.message);
            setErrorCSS('error-message');
        }
    }

    return (
        <form id="new-device" className="new-device-section-2" onSubmit={handleConnectClick}>
                    
            <div className='new-device-logo'>
                <img className="new-device-logo-img" src={plus_circle} alt="New device logo"></img>
                <h1 className="new-device-logo-txt">New Device</h1>
            </div>
            
            <InputField onChange={(e) => setDeviceLocation(e.target.value)} inputImg={location} isRequired={true} type='text' placeholder='Location' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField onChange={(e) => setAssetNumber(e.target.value)} inputImg={tag} isRequired={true} type='text' placeholder='Asset Number' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField onChange={(e) => setWifiSSID(e.target.value)} inputImg={wifi} isRequired={true} type='text' placeholder='Wifi SSID' isSpellCheck={false} setWidth={'60%'}></InputField>
            <InputField onChange={(e) => setWifiPassword(e.target.value)} inputImg={lock} isRequired={true} type='password' placeholder='Wifi Password' isSpellCheck={false} setWidth={'60%'}></InputField>
            
            <div className='new-device-section-2-btns'>
                <button className='text-btn hidden'><span>Change Password?</span></button>
                <Button children='Connect' type='submit' isPrimaryStyle={false}></Button>
            </div>
            <h4 className={errorCSS}>{error}</h4>
        </form>
    );
}