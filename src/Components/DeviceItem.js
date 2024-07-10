import {useState , useEffect} from "react";

export default function DeviceItem({devices, index, setDevice, device, setAddDeviceToggle, setSettingsToggle, from, settingsToggle, connectDeviceToggle}) {

    const [colorStyle, setColorStyle] = useState("device-line");

    const handleDeviceClick = () => {

        if (from === "Settings"){
            setSettingsToggle(false);
            setAddDeviceToggle(false);
        }

        setDevice(devices);
    }
    
    useEffect(() =>{

        if (Object.keys(device).length !== 0){
            if(device.cat_num === devices.cat_num){

                if (settingsToggle && connectDeviceToggle == false){
                    console.log("here1");
                    setColorStyle("device-line");
                    return;
                }

                setColorStyle("device-line selected");
                
                if (from === "Performance"){
                    setSettingsToggle(false);
                    setAddDeviceToggle(false);
                    
                }

                if (device.cat_num === devices.cat_num && (device.wifi_ssid !== devices.wifi_ssid || device.wifi_password !== devices.wifi_password || device.connection_status !== devices.connection_status || device.automate !== devices.automate)){
                    setDevice(devices);
                }

            } else {
                setColorStyle("device-line");
            }

        } else{
            if (index === 0){
                if(device.cat_num !== devices.cat_num){
                    setDevice(devices);
                }
            }
        }

    },[devices,settingsToggle])
    
    return (
        <li>
            <div className={colorStyle} onClick={handleDeviceClick}>
                <h4 className="device-identifier">{devices.location} - {devices.cat_num}</h4>
            </div>
        </li>
    );
}