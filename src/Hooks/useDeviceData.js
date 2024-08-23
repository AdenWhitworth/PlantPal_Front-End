import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from "../Provider/AuthProvider";
import { useDevice } from '../Provider/DeviceProvider';

export const useDeviceData = (handleLogout) => {

    const { token } = useAuth();
    const { devices, setDevices, device, setDevice, deviceShadow, setDeviceShadow, deviceLogs, setDeviceLogs, lastLog, setLastLog, refreshDate, setRefreshDate } = useDevice();

    const client = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        headers: { "Authorization": "Bearer " + token }
    });

    const fetchUserDevices = async () => {
        try {
            const response = await client.get("/dashboard/userDevices");
            setDevices(response.data.devices);
        } catch (error) {
            handleLogout();
        }
    };

    const fetchDeviceLogs = async () => {
        try {
            const response = await client.get("/dashboard/deviceLogs", { params: { cat_num: device.cat_num } });
            setDeviceLogs(response.data.deviceLogs);
            setLastLog(response.data.lastLog);
        } catch (error) {
            handleLogout();
        }
    };

    const fetchDeviceShadow = async () => {
        try {
            const response = await client.get("/dashboard/deviceShadow", { params: { thingName: device.thing_name } });
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
        if (typeof lastLog !== "undefined") {
            formatRefreshDate();
        } else {
            setRefreshDate("");
        }
    }, [lastLog]);

    return {
        fetchUserDevices, handleLogout
    };
};