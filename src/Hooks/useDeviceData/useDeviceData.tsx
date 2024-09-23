import { useEffect, useState, useCallback } from 'react';
import { getUserDevices, getDeviceLogs, getDeviceShadow } from '../../Services/ApiService/ApiService';
import { useAuth } from "../../Provider/AuthProvider/AuthProvider";
import { useDevice } from '../../Provider/DeviceProvider/DeviceProvider';
import { UseDeviceDataProps } from './useDeviceDataTypes';

/**
 * Custom hook to manage device data fetching and state management.
 *
 * @param {UseDeviceDataProps} props - The properties for the hook.
 * @returns {Object} The state and functions related to device data.
 * @returns {boolean} isDevicesLoading - Indicates if user devices are currently loading.
 * @returns {boolean} isDeviceLoading - Indicates if a specific device is currently loading.
 * @returns {boolean} isDevicesLoaded - Indicates if user devices have been loaded.
 * @returns {Function} fetchUserDevices - Function to fetch user devices.
 */
export const useDeviceData = ({
    handleLogout
}: UseDeviceDataProps) => {

    const [isDevicesLoading, setIsDevicesLoading] = useState<boolean>(false);
    const [isDeviceLoading, setIsDeviceLoading] = useState<boolean>(false);
    const [isDevicesLoaded, setIsDevicesLoaded] = useState<boolean>(false);
    const { accessToken, setAccessToken } = useAuth();
    const { setDevices, device, setDeviceShadow, setDeviceLogs, lastLog, setLastLog, setRefreshDate } = useDevice();

    /**
     * Fetches the user's devices from the API.
     * 
     * @function
     * @returns {Promise<void>} 
     */
    const fetchUserDevices = useCallback(async () => {
        setIsDevicesLoading(true);
        try {
            const response = await getUserDevices(accessToken, setAccessToken);
            setDevices(response.data.devices);
        } catch (error) {
            handleLogout();
        } finally {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setIsDevicesLoading(false);
        }
    }, [accessToken, setAccessToken, setDevices, handleLogout]);

    /**
     * Fetches data for a specific device, including logs and shadow.
     * 
     * @function
     * @returns {Promise<void>} 
     */
    const fetchUserDevice = useCallback(async () => {
        if (!device?.cat_num && !device?.thing_name) return;

        setIsDeviceLoading(true);
        
        try {
            const deviceLogsPromise = await getDeviceLogs(accessToken, setAccessToken, { cat_num: device.cat_num });
            const shadowPromise = await getDeviceShadow(accessToken, setAccessToken, { thingName: device.thing_name });

            const [deviceLogsResponse, shadowResponse] = await Promise.all([deviceLogsPromise, shadowPromise]);

            setDeviceLogs(deviceLogsResponse.data.deviceLogs);
            setLastLog(deviceLogsResponse.data.lastLog);
            setDeviceShadow(shadowResponse.data.deviceShadow);
        } catch (error) {
            handleLogout();
        } finally {
            setIsDeviceLoading(false);
        }
    }, [accessToken, setAccessToken, device, handleLogout, setDeviceLogs, setLastLog, setDeviceShadow]);

    /**
     * Checks if an object is empty.
     * 
     * @function
     * @param {Object} obj - The object to check.
     * @returns {boolean} True if the object is empty, otherwise false.
     */
    const isObjectEmpty = useCallback((obj: object): boolean => {
        return Object.keys(obj).length === 0;
    }, []);

    /**
     * Formats the refresh date based on the last log.
     * 
     * @function
     * @returns {void}
     */
    const formatRefreshDate = useCallback(() => {
        if (!lastLog || isObjectEmpty(lastLog)) {
            setRefreshDate("");
            return;
        }

        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dateObject = new Date(lastLog.log_date);
        const localTimeString = dateObject.toLocaleString(undefined, { timeZone: userTimeZone });
          
        setRefreshDate(localTimeString);
    }, [lastLog, setRefreshDate, isObjectEmpty]);

    /**
     * Effect to fetch user device data whenever the selected device changes.
     */
    useEffect(() => {
        fetchUserDevice();
    }, [device, fetchUserDevice]);

    /**
     * Effect to manage loading states for devices. 
     * Sets isDevicesLoaded to true when devices are loading and resets it when loading is finished.
     */
    useEffect(() => {
        if (isDevicesLoading) {
            setIsDevicesLoaded(true);
        }
        if (!isDevicesLoading && isDevicesLoaded) {
            setIsDevicesLoaded(false);
        }
    }, [isDevicesLoading, isDevicesLoaded]);

    /**
     * Effect to format and set the refresh date whenever lastLog changes.
     */
    useEffect(() => {
        formatRefreshDate();
    }, [lastLog, formatRefreshDate]);

    return {
        fetchUserDevices, handleLogout, isDevicesLoading, isDeviceLoading, isDevicesLoaded
    };
};