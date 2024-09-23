/**
 * Props for the DeviceMenu component.
 * @interface DeviceMenuProps
 * @property {boolean} connectDeviceToggle - Indicates whether the device connection toggle is active.
 * @property {Function} showAddDeviceView - Function to display the view for adding a new device.
 * @property {boolean} isSettingsVisible - Indicates whether the settings view is currently visible.
 * @property {Function} showPerformanceView - Function to show the performance view for a device.
 */
export interface DeviceMenuProps {
    connectDeviceToggle: boolean;
    showAddDeviceView: () => void;
    isSettingsVisible: boolean;
    showPerformanceView: () => void;
}