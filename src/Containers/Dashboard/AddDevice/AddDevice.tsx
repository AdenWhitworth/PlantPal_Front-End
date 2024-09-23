import React, {useState, useEffect, useCallback} from 'react';
import {useAuth} from '../../../Provider/AuthProvider/AuthProvider';
import useBluetooth from '../../../Hooks/useBluetooth/useBluetooth';
import { useDevice } from '../../../Provider/DeviceProvider/DeviceProvider';
import AddDeviceForm from './AddDeviceForm/AddDeviceForm';
import { useSettingsHandlers } from '../../../Hooks/useSettingsHandlers/useSettingsHandlers';
import './AddDevice.css';
import { AddDeviceProps, WifiDetails } from './AddDeviceTypes';

/**
 * Component for adding a new device.
 * 
 * @component
 * @param {AddDeviceProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function AddDevice({
    setConnectDeviceToggle, 
    showPerformanceView
}:AddDeviceProps): JSX.Element {

    const [wifiDetails, setWifiDetails] = useState<WifiDetails>({
        deviceLocation: '',
        assetNumber: '',
        wifiSSID: '',
        wifiPassword: ''
    });
    const { connectBluetooth, sendCredentials, bleDevice } = useBluetooth();
    const { accessToken, setAccessToken } = useAuth();
    const { setDevice } = useDevice();
    const { handleAddDevice, error, resetError} = useSettingsHandlers();

    /**
     * Handles input changes for the device details.
     * 
     * @function
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input field.
     */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWifiDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    /**
     * Handles the click event for connecting to the device.
     * 
     * @function
     * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
     */
    const handleConnectClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetError();
        try {
            await connectBluetooth(wifiDetails.assetNumber);
        } catch (error) {
            console.error(error);
        }
    };

    /**
     * Handles the new connection once the Bluetooth device is detected.
     * 
     * @function
     */
    const handleNewConnection = useCallback(() => {
        
        handleAddDevice(accessToken, setAccessToken,{
            location: wifiDetails.deviceLocation,
            cat_num: wifiDetails.assetNumber,
            wifi_ssid: wifiDetails.wifiSSID,
            wifi_password: wifiDetails.wifiPassword
        }, (newDeviceData: any) => {
            sendCredentials(wifiDetails.wifiSSID,wifiDetails.wifiPassword);
            setDevice(newDeviceData.data.device);
            resetError();
            setConnectDeviceToggle(true);
            showPerformanceView();
        });
    }, [accessToken, wifiDetails, handleAddDevice, resetError, sendCredentials, setAccessToken, setConnectDeviceToggle, setDevice, showPerformanceView]);
    
    /**
     * Effect that triggers when the Bluetooth device is detected.
     * Calls the handleNewConnection function to process the new device connection.
     */
    useEffect(() => {
        if (bleDevice){
            handleNewConnection();
        }
    },[bleDevice, handleNewConnection]);

    /**
     * Effect that resets any existing errors when the component mounts or the resetError function changes.
     */
    useEffect(() => {
        resetError();
    }, [resetError]);

    return (
        <div className='dashboard-add-device'>
            <AddDeviceForm
                handleInputChange={handleInputChange}
                error={error}
                handleConnectClick={handleConnectClick}
            ></AddDeviceForm>
        </div>
    );
}