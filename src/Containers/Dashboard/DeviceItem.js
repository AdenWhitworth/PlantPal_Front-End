import {useState , useEffect, useCallback} from "react";
import { useDevice } from '../../Provider/DeviceProvider';

export default function DeviceItem({
    devices, 
    index,  
    connectDeviceToggle,
    isSettingsVisible,
    showPerformanceView
}) {

    const [colorStyle, setColorStyle] = useState("device-line");
    const { device, setDevice } = useDevice();

    const handleDeviceClick = useCallback(() => {
        if (isSettingsVisible) {
            showPerformanceView();
        }
        setDevice(devices);
    }, [isSettingsVisible, devices, setDevice]);
    
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
            <div className={colorStyle} onClick={handleDeviceClick}>
                <h4 className="device-identifier">{devices.location} - {devices.cat_num}</h4>
            </div>
        </li>
    );
}