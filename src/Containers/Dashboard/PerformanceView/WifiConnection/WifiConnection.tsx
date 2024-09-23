import React, {useState, useEffect} from 'react';
import wifi from "../../../../Images/wifi-green.svg";
import triangle from "../../../../Images/triangle-orange.svg";
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';
import Button from '../../../../Components/Button/Button';
import useBluetooth from "../../../../Hooks/useBluetooth/useBluetooth";
import {useAuth} from '../../../../Provider/AuthProvider/AuthProvider';
import EditWifiForm from './EditWifiForm/EditWifiForm';
import { useSettingsHandlers } from '../../../../Hooks/useSettingsHandlers/useSettingsHandlers';
import './WifiConnection.css';
import { WifiConnectionProps, WifiDetails } from './WifiConnectionTypes';

/**
 * Component that manages WiFi connection settings for a device.
 * 
 * @component
 * @param {WifiConnectionProps} props - The component props.
 * @returns {JSX.Element} The rendered WifiConnection component.
 */
export default function WifiConnection({
    setConnectDeviceToggle,
    handleRefreshClick
}:WifiConnectionProps): JSX.Element {

    const [wifiDetails, setWifiDetails] = useState<WifiDetails>({
        wifiSSID: '',
        wifiPassword: ''
    });
    const [isConnectionVisible, setIsConnectionVisible] = useState<boolean>(false);
    const [updateWifiToggle, setUpdateWifiToggle] = useState<boolean>(false);
    const { connectBluetooth, sendCredentials, bleDevice } = useBluetooth();
    const { devices, device } = useDevice();
    const { accessToken, setAccessToken } = useAuth();
    const { handleUpdateWifi, error, resetError} = useSettingsHandlers();

    /**
     * Handles input changes in the WiFi details form.
     * 
     * @function
     * @param {React.ChangeEvent<HTMLInputElement>} e - The input change event.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWifiDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handles the click event for changing WiFi.
     * 
     * @function
     */
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

    /**
     * Handles the form submission for updating WiFi credentials.
     * 
     * @function
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
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

    /**
     * Effect to set visibility based on available devices
     */
    useEffect(() => {
        setIsConnectionVisible(devices.length > 0);
    }, [devices]);

    /**
     * Effect to update toggle based on Bluetooth device connection
     */
    useEffect(() => {
        if (bleDevice){
            setUpdateWifiToggle(true);
        }
    },[bleDevice]);

    return (
        <div data-testid="dashboard-connection" className={`dashboard-connection ${isConnectionVisible ? '' : 'hidden'}`}>
                
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
                    <Button styleType='tertiary' onClick={handleChangeWifiClick} testId="change-wifi-btn">Change Wifi?</Button>
                </div>
            }
        </div>
    );
}