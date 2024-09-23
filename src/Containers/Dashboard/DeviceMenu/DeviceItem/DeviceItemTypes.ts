import { Device } from "../../../../Provider/DeviceProvider/DeviceProviderTypes";

/**
 * Props for the DeviceItem component.
 *
 * @interface DeviceItemProps
 * @property {Device} devices - The device data to be displayed by the component.
 * @property {number} index - The index of the device within a list of devices.
 * @property {boolean} connectDeviceToggle - Indicates whether the device connection toggle is active.
 * @property {boolean} isSettingsVisible - Indicates whether the settings view is currently visible.
 * @property {() => void} showPerformanceView - Function to display the performance view for the device.
 */
export interface DeviceItemProps {
    devices: Device;
    index: number;
    connectDeviceToggle: boolean;
    isSettingsVisible: boolean
    showPerformanceView: () => void;
}