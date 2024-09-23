import React, { createContext, ReactNode, useContext, useState } from 'react';
import { DeviceLog, Device, DeviceShadow, DeviceContextType } from './DeviceProviderTypes';


const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const useDevice = (): DeviceContextType => {
    const context = useContext(DeviceContext);
    if (context === undefined) {
        throw new Error('useDevice must be used within a DeviceProvider');
    }
    return context;
};

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [device, setDevice] = useState<Device | null>(null);
    const [deviceShadow, setDeviceShadow] = useState<DeviceShadow | null>(null);
    const [deviceLogs, setDeviceLogs] = useState<DeviceLog[]>([]);
    const [lastLog, setLastLog] = useState<DeviceLog | null>(null);
    const [refreshDate, setRefreshDate] = useState<string>("");

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
