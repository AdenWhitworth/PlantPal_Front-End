import { useEffect } from 'react';
import { getUserDevices, getDeviceLogs, getDeviceShadow } from '../Services/ApiService';
import { useAuth } from "../Provider/AuthProvider";
import { useDevice } from '../Provider/DeviceProvider';

export const useDeviceData = (handleLogout) => {

    const { accessToken, setAccessToken } = useAuth();
    const { setDevices, device, setDeviceShadow, setDeviceLogs, lastLog, setLastLog, setRefreshDate } = useDevice();

    const fetchUserDevices = async () => {
        try {
            const response = await getUserDevices(accessToken, setAccessToken);
            setDevices(response.data.devices);
        } catch (error) {
            handleLogout();
        }
    };

    const fetchDeviceLogs = async () => {
        try {
            const response = await getDeviceLogs(accessToken, setAccessToken, { params: { cat_num: device.cat_num }});
            setDeviceLogs(response.data.deviceLogs);
            setLastLog(response.data.lastLog);
        } catch (error) {
            handleLogout();
        }
    };

    const fetchDeviceShadow = async () => {
        try {
            const response = await getDeviceShadow(accessToken, setAccessToken, { params: { thingName: device.thing_name } });
            setDeviceShadow(response.data.deviceShadow);
        } catch (error) {
            handleLogout();
        }
    };

    const formatRefreshDate = () => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dateObject = new Date(lastLog.log_date);

        const localTimeString = dateObject.toLocaleString(undefined, {
            timeZone: userTimeZone,
        });
          
        setRefreshDate(localTimeString);
    }

    const isObjectEmpty = (obj) => {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    useEffect(() => {
        if (device.cat_num) {
            fetchDeviceLogs();
        }
    }, [device]);

    useEffect(() => {
        if (device.thing_name) {
            fetchDeviceShadow();
        }
    }, [device]);

    useEffect(() => {
        if (!isObjectEmpty(lastLog)) {
            formatRefreshDate();
        } else {
            setRefreshDate("");
        }
    }, [lastLog]);

    return {
        fetchUserDevices, handleLogout
    };
};