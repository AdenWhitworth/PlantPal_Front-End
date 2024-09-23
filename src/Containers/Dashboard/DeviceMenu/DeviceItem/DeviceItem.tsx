import React, {useState , useEffect, useCallback} from "react";
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';
import './DeviceItem.css';
import { DeviceItemProps } from "./DeviceItemTypes";

/**
 * DeviceItem component displays individual device information and handles interactions.
 *
 * @component
 * @param {DeviceItemProps} props - The component props.
 * @returns {JSX.Element} The rendered component.
 */
export default function DeviceItem({
    devices, 
    index,  
    connectDeviceToggle,
    isSettingsVisible,
    showPerformanceView
}: DeviceItemProps): JSX.Element {
    const [colorStyle, setColorStyle] = useState<string>("device-line");
    const { device, setDevice } = useDevice();

    /**
     * Handles the click event on the device item.
     * If the settings view is visible, it shows the performance view.
     * Sets the current device in the context.
     * 
     * @function
     */
    const handleDeviceClick = useCallback(() => {
        if (isSettingsVisible) {
            showPerformanceView();
        }
        setDevice(devices);
    }, [isSettingsVisible, devices, setDevice, showPerformanceView]);
    
    /**
     * Checks if the current device matches the clicked device.
     * Updates the color style based on the settings visibility and connection toggle state.
     * If the device properties have changed, updates the device in context.
     */
    useEffect(() => {
        const isSameDevice = device?.cat_num === devices.cat_num;
        const hasDeviceChanged = 
            device?.wifi_ssid !== devices.wifi_ssid || 
            device?.wifi_password !== devices.wifi_password || 
            device?.presence_connection !== devices.presence_connection;

        if (isSameDevice) {
            setColorStyle(isSettingsVisible && !connectDeviceToggle ? "device-line" : "device-line selected");
            if (hasDeviceChanged) {
                setDevice(devices);
            }
        } else if (index === 0) {
            setDevice(devices);
        } else {
            setColorStyle("device-line");
        }

    }, [devices, device, index, connectDeviceToggle, setDevice, isSettingsVisible]);
    
    return (
        <li>
            <div className={colorStyle} onClick={handleDeviceClick} data-testid="device-btn">
                <h4 className="device-identifier">{devices.location} - {devices.cat_num}</h4>
            </div>
        </li>
    );
}