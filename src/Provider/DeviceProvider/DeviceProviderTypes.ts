/**
 * Represents a device in the system.
 *
 * @interface Device
 * @property {number} device_id - The unique identifier for the device.
 * @property {string} cat_num - The category number of the device.
 * @property {number} user_id - The ID of the user associated with the device.
 * @property {string} wifi_ssid - The WiFi SSID for the device.
 * @property {string} wifi_password - The password for the device's WiFi.
 * @property {string} init_vec - The initialization vector used for encryption.
 * @property {boolean} presence_connection - Indicates whether the device is currently connected.
 * @property {string} location - The physical location of the device.
 * @property {string} thing_name - The name of the device in AWS IoT.
 */
export interface Device {
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

/**
 * Represents the shadow state of a device.
 *
 * @interface DeviceShadow
 * @property {Object} state - The state of the device.
 * @property {Object} state.reported - The reported state of the device.
 * @property {string} state.reported.welcome - Welcome message for the device.
 * @property {boolean} state.reported.connected - Indicates if the device is connected.
 * @property {boolean} state.reported.auto - Auto mode status of the device.
 * @property {boolean} state.reported.pump - Pump status of the device.
 * @property {Object} state.desired - The desired state of the device.
 * @property {string} state.desired.welcome - Desired welcome message for the device.
 * @property {boolean} state.desired.connected - Indicates if the device should be connected.
 * @property {boolean} state.desired.auto - Desired auto mode status of the device.
 * @property {boolean} state.desired.pump - Desired pump status of the device.
 * @property {any} [metadata] - Optional metadata related to the device state.
 */
export interface DeviceShadow {
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

/**
 * Represents a log entry for a device.
 *
 * @interface DeviceLog
 * @property {number} log_id - The unique identifier for the log entry.
 * @property {string} cat_num - The category number of the device associated with the log.
 * @property {number} soil_temp - The recorded soil temperature.
 * @property {number} soil_cap - The soil capacitance measurement.
 * @property {string} log_date - The date and time the log entry was recorded.
 * @property {number} water - The amount of water recorded.
 */
export interface DeviceLog {
    log_id: number;
    cat_num: string;
    soil_temp: number;
    soil_cap: number;
    log_date: string;
    water: number;
}

/**
 * Context type for managing device-related state.
 *
 * @interface DeviceContextType
 * @property {Device[]} devices - The array of devices managed in the context.
 * @property {React.Dispatch<React.SetStateAction<Device[]>>} setDevices - Function to update the array of devices.
 * @property {Device | null} device - The currently selected device or null if none is selected.
 * @property {React.Dispatch<React.SetStateAction<Device | null>>} setDevice - Function to set the currently selected device.
 * @property {DeviceShadow | null} deviceShadow - The shadow state of the currently selected device or null if none is selected.
 * @property {React.Dispatch<React.SetStateAction<DeviceShadow | null>>} setDeviceShadow - Function to set the shadow state of the currently selected device.
 * @property {DeviceLog[]} deviceLogs - The array of logs associated with devices.
 * @property {React.Dispatch<React.SetStateAction<DeviceLog[]>>} setDeviceLogs - Function to update the array of device logs.
 * @property {DeviceLog | null} lastLog - The most recent log entry or null if no logs exist.
 * @property {React.Dispatch<React.SetStateAction<DeviceLog | null>>} setLastLog - Function to set the most recent log entry.
 * @property {string} refreshDate - The date and time when the device data was last refreshed.
 * @property {React.Dispatch<React.SetStateAction<string>>} setRefreshDate - Function to update the refresh date.
 */
export interface DeviceContextType {
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

/**
 * Props for the TestDeviceComponent.
 * @interface TestDeviceComponentProps
 * @property {boolean} [testSetters] - Flag to indicate whether to set mock data in the component.
 */
export interface TestDeviceComponentProps {
    testSetters?: boolean;
}