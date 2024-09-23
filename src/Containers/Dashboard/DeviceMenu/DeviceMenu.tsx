import React, {useState, useEffect, useCallback, useMemo} from 'react';
import DeviceItem from "./DeviceItem/DeviceItem";
import InputField from "../../../Components/InputField/InputField";
import glass from "../../../Images/glass-brown.svg";
import plus from "../../../Images/plus-circle-green.svg";
import { useDevice } from '../../../Provider/DeviceProvider/DeviceProvider';
import './DeviceMenu.css';
import { DeviceMenuProps } from './DeviceMenuTypes';

/**
 * DeviceMenu component that renders a list of devices with a search functionality.
 *
 * @component
 * @param {DeviceMenuProps} props - The props for the DeviceMenu component.
 * @returns {JSX.Element} The rendered DeviceMenu component.
 */
export default function DeviceMenu({
    connectDeviceToggle, 
    showAddDeviceView,
    isSettingsVisible,
    showPerformanceView
}: DeviceMenuProps): JSX.Element {

    const { device, devices } = useDevice();
    const [searchTerm, setSearchTerm] = useState<string>('');

    /**
     * Handles changes in the search input field.
     * 
     * @function
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the input field.
     */
    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    }, []);

    /**
     * Filters the list of devices based on the search term.
     * 
     * @function
     * @returns {Device[]} - An array of devices that match the search criteria.
     */
    const filteredDevices = useMemo(() => {
        if (!devices) return [];
        if (!searchTerm) return devices;
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return devices.filter(device => 
            device.location.toLowerCase().includes(lowerCaseSearchTerm) || 
            device.cat_num.toLowerCase().includes(lowerCaseSearchTerm)
        );
    }, [devices, searchTerm]);

    /**
     * Reset the search term when the current device changes
     */
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
                    onClick={showAddDeviceView}
                ></img>
            </div>

            <div className='devices'>
                <ul className='device-list'>
                    { filteredDevices.map((filteredDevices, index) => 
                        <DeviceItem 
                            key={filteredDevices.device_id} 
                            devices={filteredDevices} 
                            index={index}  
                            connectDeviceToggle={connectDeviceToggle}
                            isSettingsVisible={isSettingsVisible}
                            showPerformanceView={showPerformanceView}
                        ></DeviceItem>)
                    }
                </ul>
            </div>
        </div>
    );
}