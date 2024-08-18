import React, { createContext, useContext, useState } from 'react';

const DeviceContext = createContext();

export const useDevice = () => useContext(DeviceContext);

export const DeviceProvider = ({ children }) => {
    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState({});
    const [deviceShadow, setDeviceShadow] = useState({});
    const [deviceLogs, setDeviceLogs] = useState([]);
    const [lastLog, setLastLog] = useState({});
    const [refreshDate, setRefreshDate] = useState("");

    return (
        <DeviceContext.Provider value={{
            devices,
            setDevices,
            device,
            setDevice,
            deviceShadow,
            setDeviceShadow,
            deviceLogs,
            setDeviceLogs,
            lastLog,
            setLastLog,
            refreshDate,
            setRefreshDate
        }}>
            {children}
        </DeviceContext.Provider>
    );
};
