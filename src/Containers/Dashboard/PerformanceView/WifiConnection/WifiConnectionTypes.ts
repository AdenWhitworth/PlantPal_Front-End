/**
 * Represents the details of a WiFi connection.
 * 
 * @interface WifiDetails
 * @property {string} wifiSSID - The SSID (name) of the WiFi network.
 * @property {string} wifiPassword - The password for the WiFi network.
 */
export interface WifiDetails {
    wifiSSID: string;
    wifiPassword: string;
}

/**
 * Props for the WifiConnection component.
 * 
 * @interface WifiConnectionProps
 * @property {(value: boolean) => void} setConnectDeviceToggle - A function to set the toggle state for connecting a device.
 * @property {() => void} handleRefreshClick - A function to handle refreshing the WiFi connection.
 */
export interface WifiConnectionProps {
    setConnectDeviceToggle: (value: boolean) => void;
    handleRefreshClick: () => void;
}
