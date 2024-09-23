/**
 * Props for the AddDevice component.
 * 
 * @interface AddDeviceProps
 * @property {Function} setConnectDeviceToggle - Function to toggle the connection status of the device.
 * @property {Function} showPerformanceView - Function to display the performance view.
 */
export interface AddDeviceProps {
    setConnectDeviceToggle: (value: boolean) => void;
    showPerformanceView: () => void;
}

/**
 * Represents the details required for connecting a Wi-Fi device.
 * 
 * @interface WifiDetails
 * @property {string} deviceLocation - The location of the device.
 * @property {string} assetNumber - The asset number of the device.
 * @property {string} wifiSSID - The SSID of the Wi-Fi network.
 * @property {string} wifiPassword - The password for the Wi-Fi network.
 */
export interface WifiDetails {
    deviceLocation: string;
    assetNumber: string;
    wifiSSID: string;
    wifiPassword: string;
}