import React, {useState, useEffect, useCallback} from 'react';
import {useAuth} from '../../Provider/AuthProvider';
import useBluetooth from '../../Hooks/useBluetooth';
import { useDevice } from '../../Provider/DeviceProvider';
import AddDeviceForm from './AddDeviceForm';
import { useSettingsHandlers } from '../../Hooks/useSettingsHandlers';
import './AddDevice.css';

interface AddDeviceProps {
    setConnectDeviceToggle: (value: boolean) => void;
    showPerformanceView: () => void;
}

interface WifiDetails {
    deviceLocation: string;
    assetNumber: string;
    wifiSSID: string;
    wifiPassword: string;
}

export default function AddDevice({
    setConnectDeviceToggle, 
    showPerformanceView
}:AddDeviceProps) {

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setWifiDetails((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleConnectClick = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetError();
        try {
            await connectBluetooth(wifiDetails.assetNumber);
        } catch (error) {
            console.error(error);
        }
    };

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
    
    useEffect(() => {
        if (bleDevice){
            handleNewConnection();
        }
    },[bleDevice, handleNewConnection]);

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