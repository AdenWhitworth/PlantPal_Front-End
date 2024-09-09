import React, { createContext, ReactNode, useContext, useState } from 'react';

interface Device {
    device_id: number;
    cat_num: string;
    user_id: number;
    wifi_ssid: string;
    wifi_password: string;
    init_vec: string;
    presence_connection: boolean;
    location: string;
    thing_name: string;
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

interface DeviceLog {
    log_id: number;
    cat_num: string;
    soil_temp: number;
    soil_cap: number;
    log_date: string;
    water: number;
}

interface DeviceContextType {
    devices: Device[];
    setDevices: React.Dispatch<React.SetStateAction<Device[]>>;
    device: Device | null;
    setDevice: React.Dispatch<React.SetStateAction<Device | null>>;
    deviceShadow: DeviceShadow | null;
    setDeviceShadow: React.Dispatch<React.SetStateAction<DeviceShadow | null>>; 
    deviceLogs: DeviceLog[];
    setDeviceLogs: React.Dispatch<React.SetStateAction<DeviceLog[]>>;
    lastLog: DeviceLog | null;
    setLastLog: React.Dispatch<React.SetStateAction<DeviceLog | null>>;
    refreshDate: string;
    setRefreshDate: React.Dispatch<React.SetStateAction<string>>;
}

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
