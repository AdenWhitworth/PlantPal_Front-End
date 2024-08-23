import React, {useState, useEffect, useCallback, useMemo} from 'react';
import DeviceItem from "./DeviceItem";
import InputField from "../../Components/InputField";
import glass from "../../Images/glass-brown.svg";
import plus from "../../Images/plus-circle-green.svg";
import { useDevice } from '../../Provider/DeviceProvider';

export default function DeviceMenu({
    settingsToggle, 
    setSettingsToggle, 
    connectDeviceToggle, 
    setAddDeviceToggle
}) {

    const { device, devices } = useDevice();
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleAddDeviceClick = useCallback(() => {
        setAddDeviceToggle(true);
        setSettingsToggle(true);
    }, [setAddDeviceToggle, setSettingsToggle]);

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const filteredDevices = useMemo(() => {
        if (!searchTerm) return devices;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return devices.filter(device => 
            device.location.toLowerCase().includes(lowerCaseSearchTerm) || 
            device.cat_num.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [devices, searchTerm]);

    useEffect(() => {
        setSearchTerm('');
    },[device]);

    return (
        <div className='dashboard-menu'>

            <h2 className='menu-txt'>Devices</h2>
            
            <div className='menu-options'>
                <InputField 
                    inputImg={glass} 
                    isRequired={false} 
                    type='text' 
                    placeholder='Search' 
                    isSpellCheck={false} 
                    setWidth={'100%'} 
                    value={searchTerm} 
                    onChange={handleSearchChange}
                ></InputField>
                <img 
                    src={plus} 
                    alt='Plus Icon' 
                    className='add-device grow' 
                    onClick={handleAddDeviceClick}
                ></img>
            </div>

            <div className='devices'>
                <ul className='device-list'>
                    { filteredDevices.map((filteredDevices, index) => 
                        <DeviceItem 
                            key={filteredDevices.device_id} 
                            devices={filteredDevices} 
                            index={index} 
                            setAddDeviceToggle={setAddDeviceToggle} 
                            setSettingsToggle={setSettingsToggle} 
                            from="Performance" 
                            settingsToggle={settingsToggle} 
                            connectDeviceToggle={connectDeviceToggle}
                        ></DeviceItem>)
                    }
                </ul>
            </div>
        </div>
    );
}