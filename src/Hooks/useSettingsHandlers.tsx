import { useState, useCallback } from 'react';
import { postAddDevice, postUpdateUser, postUpdateWifi, postUpdateAuto, postUpdatePumpWater } from '../Services/ApiService';

interface UserData {
    email: string;
    first_name: string;
    last_name: string;
}

interface DeviceData {
    location: string;
    cat_num: string;
    wifi_ssid: string;
    wifi_password: string;
}

interface WifiData {
    wifi_ssid: string;
    wifi_password: string;
    device_id: number;
}

interface AuotData {
    device_id: number;
    automate: boolean;
}

interface PumpData {
    device_id: number;
    pump_water: boolean;
}

interface DeviceShadow {
    state: {
        reported: {
            welcome: string;
            connected: boolean;
            auto: boolean;
            pump: boolean;
        };
        desired: {
            welcome: string;
            connected: boolean;
            auto: boolean;
            pump: boolean;
        };
    };
    metadata?: any;
}


export const useSettingsHandlers = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const validateUpdateUserform = (userData: UserData) => {
        if (!userData.email || !userData.first_name || !userData.last_name) {
            setError('Email, first name, and last name are required.');
            return false;
        }
        return true;
    };

    const validateAddDeviceform = (deviceData: DeviceData) => {

        if (!deviceData.location || !deviceData.cat_num || !deviceData.wifi_ssid || !deviceData.wifi_password) {
            setError('Location, asset number, Wifi SSID, and Wifi Password required');
            return false;
        }
        return true;
    };

    const validateUpdateWifiform = (wifiData: WifiData) => {
        if (!wifiData.wifi_ssid || !wifiData.wifi_password || !wifiData.device_id) {
            setError('Device id, Wifi SSID, and Wifi Password required');
            return false;
        }
        return true;
    };

    const validateUpdateAuto = (autoData: AuotData) => {
        if (!autoData.device_id || !autoData.automate) {
            setError('Device id, and Automate required');
            return false;
        }
        return true;
    }

    const validateUpdatePump = (pumpData: PumpData) => {
        if (!pumpData.device_id || !pumpData.pump_water) {
            setError('Device id, and Pump Water required');
            return false;
        }
        return true;
    }

    const handleUpdateUser = async (e:React.FormEvent<HTMLFormElement>, accessToken: string | null, setAccessToken: (value: string) => void, userData: UserData, onSuccess: (updatedUserData: object) => void) => {
        e.preventDefault();
        resetError();
        if (!validateUpdateUserform(userData)) return;
            setIsLoading(true);
        try {
            const updatedUserData = await postUpdateUser(accessToken, setAccessToken, userData);
            if (onSuccess) onSuccess(updatedUserData);
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again later.';

            if (error instanceof Error && error.hasOwnProperty('response')) {
                const axiosError = error as any;

                errorMessage = axiosError.response?.data?.message || 'Failed to update user';
            }

            setError(errorMessage);

        } finally {
            setIsLoading(false);
        }
    };

    const handleAddDevice = async (accessToken: string | null, setAccessToken: (value: string) => void, deviceData: DeviceData, onSuccess: (newDeviceData: object) => void) => {
        resetError();
        if (!validateAddDeviceform(deviceData)) return;
            setIsLoading(true);
        try {
            const newDeviceData = await postAddDevice(accessToken, setAccessToken,deviceData);
            if (onSuccess) onSuccess(newDeviceData);
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again later.';

            if (error instanceof Error && error.hasOwnProperty('response')) {
                const axiosError = error as any;

                errorMessage = axiosError.response?.data?.message || 'Failed to add new device';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleUpdateWifi = async (accessToken: string | null, setAccessToken: (value: string) => void, wifiData: WifiData, onSuccess: () => void) => {
        resetError();
        if (!validateUpdateWifiform(wifiData)) return;
            setIsLoading(true);
        try {
            await postUpdateWifi(accessToken, setAccessToken, wifiData)
            if (onSuccess) onSuccess();
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again later.';

            if (error instanceof Error && error.hasOwnProperty('response')) {
                const axiosError = error as any;

                errorMessage = axiosError.response?.data?.message || 'Failed to update wifi';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpdateAuto = async (accessToken: string | null, setAccessToken: (value: string) => void, deviceShadow: DeviceShadow | null, autoSwitch: boolean, autoData: AuotData) => {
        resetError();
        if (!deviceShadow){
            setError("Missing device shadow");
            return;
        }

        if ((deviceShadow.state.reported.pump || deviceShadow.state.desired.pump) && autoSwitch){
            setError("Cannot switch to auto while waiting to pump water");
            return;
        }
        if (!validateUpdateAuto(autoData)) return;
            setIsLoading(true);
        try {
            await postUpdateAuto(accessToken, setAccessToken, autoData)
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again later.';

            if (error instanceof Error && error.hasOwnProperty('response')) {
                const axiosError = error as any;

                errorMessage = axiosError.response?.data?.message || 'Failed to update auto';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const handleUpdatePumpWater = async (accessToken: string | null, setAccessToken: (value: string) => void, pumpData: PumpData, onSuccess: () => void) => {
        resetError();

        if (!validateUpdatePump(pumpData)) return;
            setIsLoading(true);
        try {
            await postUpdatePumpWater(accessToken, setAccessToken, pumpData);
            if (onSuccess) onSuccess();
        } catch (error) {
            let errorMessage = 'An unexpected error occurred. Please try again later.';

            if (error instanceof Error && error.hasOwnProperty('response')) {
                const axiosError = error as any;

                errorMessage = axiosError.response?.data?.message || 'Failed to update pump water';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    const resetError = useCallback(() => {
        setError(null);
    }, []);
    
    return { handleUpdateUser, handleAddDevice, handleUpdateWifi, handleUpdateAuto, handleUpdatePumpWater, error, isLoading, resetError };
}