/**
 * Represents user data in the system.
 * 
 * @interface UserData
 * @property {string} email - The user's email address.
 * @property {string} first_name - The user's first name.
 * @property {string} last_name - The user's last name.
 */
export interface UserData {
    email: string;
    first_name: string;
    last_name: string;
}

/**
 * Represents device data associated with a user's device.
 * 
 * @interface DeviceData
 * @property {string} location - The physical location of the device.
 * @property {string} cat_num - The category number of the device.
 * @property {string} wifi_ssid - The SSID of the Wi-Fi network to which the device is connected.
 * @property {string} wifi_password - The password for the Wi-Fi network.
 */
export interface DeviceData {
    location: string;
    cat_num: string;
    wifi_ssid: string;
    wifi_password: string;
}

/**
 * Represents Wi-Fi credentials associated with a device.
 * 
 * @interface WifiData
 * @property {string} wifi_ssid - The SSID of the Wi-Fi network.
 * @property {string} wifi_password - The password for the Wi-Fi network.
 * @property {number} device_id - The unique identifier of the device.
 */
export interface WifiData {
    wifi_ssid: string;
    wifi_password: string;
    device_id: number;
}

/**
 * Represents automation settings for a device.
 * 
 * @interface AutoData
 * @property {number} device_id - The unique identifier of the device.
 * @property {boolean} automate - Indicates whether automation is enabled for the device.
 */
export interface AutoData {
    device_id: number;
    automate: boolean;
}

/**
 * Represents pump settings for a device.
 * 
 * @interface PumpData
 * @property {number} device_id - The unique identifier of the device.
 * @property {boolean} pump_water - Indicates whether the pump should be activated.
 */
export interface PumpData {
    device_id: number;
    pump_water: boolean;
}

/**
 * Represents the state of a device shadow, including reported and desired states.
 * 
 * @interface DeviceShadow
 * @property {Object} state - The state of the device.
 * @property {Object} state.reported - The reported state of the device.
 * @property {string} state.reported.welcome - Welcome message from the device.
 * @property {boolean} state.reported.connected - Indicates if the device is connected.
 * @property {boolean} state.reported.auto - Indicates if automation is enabled.
 * @property {boolean} state.reported.pump - Indicates if the pump is activated.
 * @property {Object} state.desired - The desired state of the device.
 * @property {string} state.desired.welcome - Desired welcome message from the device.
 * @property {boolean} state.desired.connected - Desired connection status of the device.
 * @property {boolean} state.desired.auto - Desired automation status.
 * @property {boolean} state.desired.pump - Desired pump activation status.
 * @property {any} [metadata] - Optional metadata related to the device shadow.
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
