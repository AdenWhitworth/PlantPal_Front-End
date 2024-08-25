import React, {useState, useEffect} from 'react';
import wifi_logo from '../../Images/wifi-brown.svg';
import lock from '../../Images/lock-brown.svg';
import wifi from "../../Images/wifi-green.svg";
import triangle from "../../Images/triangle-orange.svg";
import { useDevice } from '../../Provider/DeviceProvider';
import Button from '../../Components/Button';
import InputField from "../../Components/InputField";
import useBluetooth from "../../Hooks/useBluetooth";
import {useAuth} from '../../Provider/AuthProvider';
import { postUpdateWifi } from '../../Services/ApiService';

export default function WifiConnection({
    setConnectDeviceToggle,
    handleRefreshClick
}) {

    const [isConnectionVisible, setIsConnectionVisible] = useState(false);
    const [updateWifiToggle, setUpdateWifiToggle] = useState(false);
    const [error, setError] = useState('Error');
    const [errorVisible, setErrorVisible] = useState(false);
    const { connectBluetooth, sendCredentials, bleDevice } = useBluetooth();
    const { devices, device } = useDevice();
    const [wifiSSID, setWifiSSID] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const { token } = useAuth();

    const handleChangeWifiClick = () => {
        connectBluetooth();
    }

    const handleUpdateWifi = async (e) => {
        e.preventDefault();

        try {
            await postUpdateWifi(token,{ 
                device_id: device.device_id, 
                wifi_ssid: wifiSSID, 
                wifi_password: wifiPassword
            })
            sendCredentials(wifiSSID,wifiPassword);
            resetError();
            document.getElementById("update-wifi").reset();
            handleRefreshClick();
            setUpdateWifiToggle(false);
            setConnectDeviceToggle(true);
        } catch (error) {
            const errorMessage = error.response?.data?.msg || 'Failed to update Wi-Fi settings';
            setError(errorMessage);
            setErrorVisible(true);
        }  
    }

    const resetError = () => {
        setError('');
        setErrorVisible(false);
    };

    useEffect(() => {
        setIsConnectionVisible(devices.length > 0);
    }, [devices]);

    useEffect(() => {
        if (bleDevice){
            setUpdateWifiToggle(true);
        }
    },[bleDevice]);

    return (
        <div className={`dashboard-connection ${isConnectionVisible ? '' : 'hidden'}`}>
                
            {updateWifiToggle?
            
                <form id='update-wifi' className='update-wifi' onSubmit={handleUpdateWifi}>
                    <h3>Connection</h3>
                    <InputField 
                        onChange={(e) => setWifiSSID(e.target.value)} 
                        inputImg={wifi_logo} 
                        isRequired={true} 
                        type='text' 
                        placeholder='Wifi SSID' 
                        isSpellCheck={false} 
                        setWidth={'60%'}
                    ></InputField>

                    <InputField 
                        onChange={(e) => setWifiPassword(e.target.value)} 
                        inputImg={lock} 
                        isRequired={true} 
                        type='password' 
                        placeholder='Wifi Password' 
                        isSpellCheck={false} 
                        setWidth={'60%'}
                    ></InputField>

                    <Button className='padded' styleType='tertiary' type='submit'>Connect Wifi?</Button>

                    {errorVisible && <h4 className='error-message'>{error}</h4>}
                </form>
                :
                <div>
                    <h3>Connection</h3>
                    <img src={device.presence_connection? wifi : triangle} alt='Connection icon'></img>
                    <h4>{device.presence_connection? "Connected": "Disconnected"}</h4>
                    <h4>SSID: {device.wifi_ssid}</h4>
                    <Button styleType='tertiary' onClick={handleChangeWifiClick}>Change Wifi?</Button>
                </div>
            }
        </div>
    );
}