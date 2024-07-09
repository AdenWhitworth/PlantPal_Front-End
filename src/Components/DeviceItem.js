import {useState , useEffect} from "react";

export default function DeviceItem({devices, index, setDevice, device, setAddDeviceToggle, setSettingsToggle, from, settingsToggle}) {

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

                if (settingsToggle){
                    setColorStyle("device-line");
                    return
                }

                setColorStyle("device-line selected");
                if (from === "Performance"){
                    setSettingsToggle(false);
                    setAddDeviceToggle(false);
                }
            } else {
                setColorStyle("device-line");
            }
        } else{
            if (index === 0){
                setDevice(devices);
            }
        }

    },[device,settingsToggle])

    return (
        <li>
            <div className={colorStyle} onClick={handleDeviceClick}>
                <h4 className="device-identifier">{devices.cat_num}</h4>
            </div>
        </li>
    );
}