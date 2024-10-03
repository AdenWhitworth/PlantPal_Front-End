import { useState, useCallback } from 'react';
import { postAddDevice, postUpdateUser, postUpdateWifi, postUpdateAuto, postUpdatePumpWater } from '../../Services/ApiService/ApiService';
import { UserData, DeviceData, DeviceShadow, WifiData, PumpData, AutoData } from './useSettingsHandlersTypes';

/**
 * Custom hook for managing settings-related actions such as user updates, device management, and error handling.
 *
 * @returns {Object} An object containing handlers for various settings-related actions.
 * @returns {Function} handleUpdateUser - Function to handle user update submissions.
 * @returns {Function} handleAddDevice - Function to handle adding new devices.
 * @returns {Function} handleUpdateWifi - Function to handle updating Wi-Fi settings.
 * @returns {Function} handleUpdateAuto - Function to handle updating automation settings.
 * @returns {Function} handleUpdatePumpWater - Function to handle updating pump water settings.
 * @returns {string | null} error - The current error message, if any.
 * @returns {boolean} isLoading - Indicates if any action is currently loading.
 * @returns {Function} resetError - Function to reset the error state.
 */
export const useSettingsHandlers = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    /**
     * Validates the user update form data.
     *
     * @function
     * @param {UserData} userData - The user data to validate.
     * @returns {boolean} True if validation passes, otherwise false.
     */
    const validateUpdateUserform = (userData: UserData): boolean => {
        if (!userData.email || !userData.first_name || !userData.last_name) {
            setError('Email, first name, and last name are required.');
            return false;
        }
        return true;
    };

    /**
     * Validates the add device form data.
     *
     * @function
     * @param {DeviceData} deviceData - The device data to validate.
     * @returns {boolean} True if validation passes, otherwise false.
     */
    const validateAddDeviceform = (deviceData: DeviceData): boolean => {

        if (!deviceData.location || !deviceData.cat_num || !deviceData.wifi_ssid || !deviceData.wifi_password) {
            setError('Location, asset number, Wifi SSID, and Wifi Password required');
            return false;
        }
        return true;
    };

    /**
     * Validates the Wi-Fi update form data.
     *
     * @function
     * @param {WifiData} wifiData - The Wi-Fi data to validate.
     * @returns {boolean} True if validation passes, otherwise false.
     */
    const validateUpdateWifiform = (wifiData: WifiData): boolean => {
        if (!wifiData.wifi_ssid || !wifiData.wifi_password || !wifiData.device_id) {
            setError('Device id, Wifi SSID, and Wifi Password required');
            return false;
        }
        return true;
    };

    /**
     * Validates the automation update form data.
     *
     * @function
     * @param {AutoData} autoData - The automation data to validate.
     * @returns {boolean} True if validation passes, otherwise false.
     */
    const validateUpdateAuto = (autoData: AutoData): boolean => {
        if (!autoData.device_id || autoData.automate === undefined || autoData.automate === null) {
            setError('Device id, and Automate required');
            return false;
        }
        return true;
    }

    /**
     * Validates the pump update form data.
     *
     * @param {PumpData} pumpData - The pump data to validate.
     * @returns {boolean} True if validation passes, otherwise false.
     */
    const validateUpdatePump = (pumpData: PumpData): boolean => {
        if (!pumpData.device_id || pumpData.pump_water === undefined || pumpData.pump_water === null) {
            setError('Device id, and Pump Water required');
            return false;
        }
        return true;
    }

    /**
     * Handles user update form submission.
     *
     * @function
     * @param {React.FormEvent<HTMLFormElement>} e - The form event.
     * @param {string | null} accessToken - The access token for authentication.
     * @param {function} setAccessToken - Function to set the access token.
     * @param {UserData} userData - The user data to update.
     * @param {function} onSuccess - Callback to call on successful update.
     */
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

    /**
     * Handles adding a new device.
     *
     * @function
     * @param {string | null} accessToken - The access token for authentication.
     * @param {function} setAccessToken - Function to set the access token.
     * @param {DeviceData} deviceData - The device data to add.
     * @param {function} onSuccess - Callback to call on successful addition.
     */
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
    
    /**
     * Handles updating Wi-Fi settings for a device.
     *
     * @function
     * @param {string | null} accessToken - The access token for authentication.
     * @param {function} setAccessToken - Function to set the access token.
     * @param {WifiData} wifiData - The Wi-Fi data to update.
     * @param {function} onSuccess - Callback to call on successful update.
     */
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

    /**
     * Handles updating the automation settings for a device.
     *
     * @function
     * @param {string | null} accessToken - The access token for authentication.
     * @param {function} setAccessToken - Function to set the access token.
     * @param {DeviceShadow | null} deviceShadow - The current state of the device shadow.
     * @param {boolean} autoSwitch - Indicates whether to switch automation on or off.
     * @param {AutoData} autoData - The automation data to update.
     */
    const handleUpdateAuto = async (accessToken: string | null, setAccessToken: (value: string) => void, deviceShadow: DeviceShadow | null, autoSwitch: boolean, autoData: AutoData) => {
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
            await postUpdateAuto(accessToken, setAccessToken, autoData);
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

    /**
     * Handles updating the pump water settings for a device.
     *
     * @function
     * @param {string | null} accessToken - The access token for authentication.
     * @param {function} setAccessToken - Function to set the access token.
     * @param {PumpData} pumpData - The pump data to update.
     * @param {function} onSuccess - Callback to call on successful update.
     */
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

    /**
     * Resets the current error state.
     * 
     * @function
     */
    const resetError = useCallback(() => {
        setError(null);
    }, []);
    
    return { setError, handleUpdateUser, handleAddDevice, handleUpdateWifi, handleUpdateAuto, handleUpdatePumpWater, error, isLoading, resetError };
}