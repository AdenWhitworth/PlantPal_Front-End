import {useState , useEffect} from "react";

export default function DeviceItem({devices, index, setDevice, device}) {

    const [colorStyle, setColorStyle] = useState("device-line");

    const handleDeviceClick = () => {
        setDevice(devices);
    }
    
    useEffect(() =>{
        if (Object.keys(device).length !== 0){
            if(device.cat_num === devices.cat_num){
                setColorStyle("device-line selected");
            } else {
                setColorStyle("device-line");
            }
        } else{
            if (index === 0){
                setDevice(devices);
            }
        }

    },[device])

    return (
        <li>
            <div className={colorStyle} onClick={handleDeviceClick}>
                <h4 className="device-identifier">{devices.cat_num}</h4>
            </div>
        </li>
    );
}