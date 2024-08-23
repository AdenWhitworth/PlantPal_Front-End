import {useState , useEffect, useCallback} from "react";
import { useDevice } from '../../Provider/DeviceProvider';

export default function DeviceItem({
    devices, 
    index, 
    setAddDeviceToggle, 
    setSettingsToggle, 
    from, 
    settingsToggle, 
    connectDeviceToggle
}) {

    const [colorStyle, setColorStyle] = useState("device-line");
    const { device, setDevice } = useDevice();

    const handleDeviceClick = useCallback(() => {
        if (from === "Settings") {
            setSettingsToggle(false);
            setAddDeviceToggle(false);
        }
        setDevice(devices);
    }, [from, devices, setSettingsToggle, setAddDeviceToggle, setDevice]);
    
    useEffect(() => {
        const isSameDevice = device.cat_num === devices.cat_num;

        if (Object.keys(device).length !== 0 && isSameDevice) {
            if (settingsToggle && !connectDeviceToggle) {
                setColorStyle("device-line");
                return;
            }

            setColorStyle("device-line selected");

            if (from === "Performance") {
                setSettingsToggle(false);
                setAddDeviceToggle(false);
            }

            const hasDeviceChanged = device.wifi_ssid !== devices.wifi_ssid || device.wifi_password !== devices.wifi_password || device.presence_connection !== devices.presence_connection;

            if (hasDeviceChanged) {
                setDevice(devices);
            }

        } else if (index === 0 && device.cat_num !== devices.cat_num) {
            setDevice(devices);
        } else {
            setColorStyle("device-line");
        }

    }, [devices, device, from, index, settingsToggle, connectDeviceToggle, setDevice, setSettingsToggle, setAddDeviceToggle]);
    
    return (
        <li>
            <div className={colorStyle} onClick={handleDeviceClick}>
                <h4 className="device-identifier">{devices.location} - {devices.cat_num}</h4>
            </div>
        </li>
    );
}