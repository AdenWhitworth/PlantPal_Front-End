import { useEffect, useState } from 'react';
import { getUserDevices, getDeviceLogs, getDeviceShadow } from '../Services/ApiService';
import { useAuth } from "../Provider/AuthProvider";
import { useDevice } from '../Provider/DeviceProvider';

interface UseDeviceDataProps {
    handleLogout: () => void;
}

export const useDeviceData = ({
    handleLogout
}: UseDeviceDataProps) => {

    const [isDevicesLoading, setIsDevicesLoading] = useState<boolean>(false);
    const [isDeviceLoading, setIsDeviceLoading] = useState<boolean>(false);
    const [isDevicesLoaded, setIsDevicesLoaded] = useState<boolean>(false);
    const { accessToken, setAccessToken } = useAuth();
    const { setDevices, device, setDeviceShadow, setDeviceLogs, lastLog, setLastLog, setRefreshDate } = useDevice();

    const fetchUserDevices = async () => {
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
    };

    const fetchUserDevice = async () => {

        if (!device?.cat_num && !device?.thing_name) {
            return;
        }

        setIsDeviceLoading(true);
        
        try {
            const deviceLogsPromise = await getDeviceLogs(accessToken, setAccessToken, { cat_num: device.cat_num });
            const shadowPromise = await getDeviceShadow(accessToken, setAccessToken, { thingName: device.thing_name });

            const [ deviceLogsResponse, shadowResponse] = await Promise.all([deviceLogsPromise, shadowPromise]);

            setDeviceLogs(deviceLogsResponse.data.deviceLogs);
            setLastLog(deviceLogsResponse.data.lastLog);
            setDeviceShadow(shadowResponse.data.deviceShadow);
        } catch (error) {
            handleLogout();
        } finally {
            setIsDeviceLoading(false);
        }
    }

    const formatRefreshDate = () => {
        if (!lastLog || isObjectEmpty(lastLog)) {
            setRefreshDate("");
            return
        }


        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dateObject = new Date(lastLog.log_date);

        const localTimeString = dateObject.toLocaleString(undefined, {
            timeZone: userTimeZone,
        });
          
        setRefreshDate(localTimeString);
    }

    const isObjectEmpty = (obj: object): boolean => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        fetchUserDevice();
    }, [device]);

    useEffect(() => {
        if (isDevicesLoading){
            setIsDevicesLoaded(true);
        }

        if (!isDevicesLoading && isDevicesLoaded){
            setIsDevicesLoaded(false);
        }

    }, [isDevicesLoading, isDevicesLoaded]);

    useEffect(() => {
        formatRefreshDate();
    }, [lastLog]);

    return {
        fetchUserDevices, handleLogout, isDevicesLoading, isDeviceLoading, isDevicesLoaded
    };
};