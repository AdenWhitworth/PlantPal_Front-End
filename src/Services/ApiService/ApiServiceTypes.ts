/**
 * Represents the data for a user.
 * 
 * @interface UserData
 * @property {string} [email] - The email address of the user.
 * @property {string} [password] - The password of the user.
 * @property {string} [first_name] - The first name of the user.
 * @property {string} [last_name] - The last name of the user.
 * @property {string} [resetToken] - The token used to reset the user's password.
 * @property {string} [user_id] - The unique identifier of the user.
 */
export interface UserData {
    email?: string;
    password?: string;
    first_name?: string;
    last_name?: string;
    resetToken?: string;
    user_id?: string;
}

/**
 * Represents the data for a device.
 * 
 * @interface DeviceData
 * @property {string} [location] - The location of the device.
 * @property {string} [cat_num] - The catalog number of the device.
 * @property {string} [wifi_ssid] - The Wi-Fi SSID the device connects to.
 * @property {string} [wifi_password] - The Wi-Fi password for the device.
 * @property {string} [thingName] - The AWS IoT thing name associated with the device.
 */
export interface DeviceData {
    location?: string;
    cat_num?: string;
    wifi_ssid?: string;
    wifi_password?: string;
    thingName?: string;
}

/**
 * Represents the Wi-Fi data for a device.
 * 
 * @interface WifiData
 * @property {string} [wifi_ssid] - The Wi-Fi SSID the device should connect to.
 * @property {string} [wifi_password] - The Wi-Fi password for the device.
 * @property {number} [device_id] - The unique identifier of the device.
 */
export interface WifiData {
    wifi_ssid?: string;
    wifi_password?: string;
    device_id?: number;
}

/**
 * Represents the automation data for a device.
 * 
 * @interface AutoData
 * @property {number} [device_id] - The unique identifier of the device.
 * @property {boolean} [automate] - Whether automation is enabled for the device.
 */
export interface AutoData {
    device_id?: number;
    automate?: boolean;
}

/**
 * Represents the pump data for a device.
 * 
 * @interface PumpData
 * @property {number} [device_id] - The unique identifier of the device.
 * @property {boolean} [pump_water] - Whether the device should pump water.
 */
export interface PumpData {
    device_id?: number;
    pump_water?: boolean;
}
