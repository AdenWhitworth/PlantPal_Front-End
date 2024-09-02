import React, {useState, useEffect, useCallback} from 'react';
import Button from '../../Components/Button';
import InputField from '../../Components/InputField';
import wifi from '../../Images/wifi-brown.svg';
import lock from '../../Images/lock-brown.svg';
import location from '../../Images/location-brown.svg';
import tag from '../../Images/tag-brown.svg';
import plus_circle from '../../Images/plus-circle-gray.svg';
import "../../App.css";
import {useAuth} from '../../Provider/AuthProvider';
import useBluetooth from '../../Hooks/useBluetooth';
import { useDevice } from '../../Provider/DeviceProvider';
import { postAddDevice } from '../../Services/ApiService';

export default function AddDevice({
    setConnectDeviceToggle, 
    showPerformanceView
}) {

    const [deviceLocation, setDeviceLocation] = useState('');
    const [assetNumber, setAssetNumber] = useState('');
    const [wifiSSID, setWifiSSID] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [error, setError] = useState('Error');
    const [errorVisible, setErrorVisible] = useState(false);
    const { connectBluetooth, sendCredentials, bleDevice } = useBluetooth();
    const { accesstoken, setAccessToken } = useAuth();
    const { setDevice } = useDevice();

    const resetError = useCallback(() => {
        setError('');
        setErrorVisible(false);
    }, []);

    const handleConnectClick = useCallback(async (e) => {
        e.preventDefault();
        resetError();
        try {
            await connectBluetooth(assetNumber);
        } catch (error) {
            setError('Bluetooth connection failed. Please try again.');
            setErrorVisible(true);
        }
    }, [connectBluetooth, resetError, assetNumber]);

    const handleNewConnection = useCallback(async () => {
        try {
            const response = await postAddDevice(accesstoken, setAccessToken,{
                location: deviceLocation,
                cat_num: assetNumber,
                wifi_ssid: wifiSSID,
                wifi_password: wifiPassword
            });

            sendCredentials();
            setDevice(response.data.newDevice);
            resetError();
            setConnectDeviceToggle(true);
            showPerformanceView();
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to add device');
            setErrorVisible(true);
        }
    }, [deviceLocation, assetNumber, wifiSSID, wifiPassword, accesstoken, sendCredentials, setDevice, setConnectDeviceToggle, showPerformanceView, resetError]);
    
    useEffect(() => {
        if (bleDevice){
            handleNewConnection();
        }
    },[bleDevice, handleNewConnection]);

    return (
        <div className='dashboard-setting'>
            <form id="new-device" className="new-device-section-2" onSubmit={handleConnectClick}>
                        
                <div className='new-device-logo'>
                    <img className="new-device-logo-img" src={plus_circle} alt="New device logo"></img>
                    <h1 className="new-device-logo-txt">New Device</h1>
                </div>
                
                <InputField 
                    onChange={(e) => setDeviceLocation(e.target.value)} 
                    inputImg={location} isRequired={true} 
                    type='text' 
                    placeholder='Location' 
                    isSpellCheck={false} 
                    setWidth={'60%'}
                ></InputField>

                <InputField 
                    onChange={(e) => setAssetNumber(e.target.value)} 
                    inputImg={tag} 
                    isRequired={true} 
                    type='text' 
                    placeholder='Asset Number' 
                    isSpellCheck={false} 
                    setWidth={'60%'}
                ></InputField>

                <InputField 
                    onChange={(e) => setWifiSSID(e.target.value)} 
                    inputImg={wifi} 
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
                
                <div className='new-device-section-2-btns'>
                    <div></div>
                    
                    <Button type='submit' styleType='secondary'>Connect</Button>
                </div>
                {errorVisible && <h4 className='error-message'>{error}</h4>}
            </form>
        </div>
    );
}