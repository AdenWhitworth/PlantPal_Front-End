/**
 * Represents the props for the AddDeviceModal component.
 *
 * @interface AddDeviceModalProps
 * @property {function} setConnectDeviceToggle - A function to set the toggle state for connecting a device.
 * @param {boolean} value - The value to set for the toggle state.
 */
export interface AddDeviceModalProps {
    setConnectDeviceToggle: (value: boolean) => void;
}
