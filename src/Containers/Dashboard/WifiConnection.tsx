import React, {useState, useEffect} from 'react';
import wifi from "../../Images/wifi-green.svg";
import triangle from "../../Images/triangle-orange.svg";
import { useDevice } from '../../Provider/DeviceProvider';
import Button from '../../Components/Button/Button';
import useBluetooth from "../../Hooks/useBluetooth";
import {useAuth} from '../../Provider/AuthProvider';
import EditWifiForm from './EditWifiForm';
import { useSettingsHandlers } from '../../Hooks/useSettingsHandlers';
import './WifiConnection.css';

interface WifiDetails {
    wifiSSID: string;
    wifiPassword: string;
}

interface WifiConnectionProps {
    setConnectDeviceToggle: (value: boolean) => void;
    handleRefreshClick: () => void;
}

export default function WifiConnection({
    setConnectDeviceToggle,
    handleRefreshClick
}:WifiConnectionProps) {

    const [wifiDetails, setWifiDetails] = useState<WifiDetails>({
        wifiSSID: '',
        wifiPassword: ''
    });
    const [isConnectionVisible, setIsConnectionVisible] = useState(false);
    const [updateWifiToggle, setUpdateWifiToggle] = useState(false);
    const { connectBluetooth, sendCredentials, bleDevice } = useBluetooth();
    const { devices, device } = useDevice();
    const { accessToken, setAccessToken } = useAuth();
    const { handleUpdateWifi, error, resetError} = useSettingsHandlers();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWifiDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleChangeWifiClick = async () => {
        if(!device || !device.cat_num){
            console.error("Device cat_num required")
            return
        }
        
        try {
            await connectBluetooth(device.cat_num);
        } catch (error) {
            console.error(error);
        }

    }

    const handleUpdateWifiSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!device || !device.device_id) {
            console.error('Device is not available');
            return;
        }

        handleUpdateWifi(accessToken, setAccessToken, {
            device_id: device.device_id, 
            wifi_ssid: wifiDetails.wifiSSID, 
            wifi_password: wifiDetails.wifiPassword
        }, () => {
            sendCredentials(wifiDetails.wifiSSID,wifiDetails.wifiPassword);
            resetError();
            (document.getElementById("update-wifi") as HTMLFormElement)?.reset();
            handleRefreshClick();
            setUpdateWifiToggle(false);
            setConnectDeviceToggle(true);
        });
    }

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
            
                <EditWifiForm
                    handleUpdateWifiSubmit={handleUpdateWifiSubmit}
                    handleInputChange={handleInputChange}
                    error={error}
                ></EditWifiForm>
                :
                <div>
                    <h3>Connection</h3>
                    <img src={device?.presence_connection? wifi : triangle} alt='Connection icon'></img>
                    <h4>{device?.presence_connection? "Connected": "Disconnected"}</h4>
                    <h4>SSID: {device?.wifi_ssid}</h4>
                    <Button styleType='tertiary' onClick={handleChangeWifiClick}>Change Wifi?</Button>
                </div>
            }
        </div>
    );
}