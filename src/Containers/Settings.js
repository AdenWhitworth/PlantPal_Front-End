import React from 'react';
import plantpal_logo from "../Images/PlantPal Logo.svg";
import gear from "../Images/gear-grey.svg";
import exit from "../Images/exit-grey.svg";
import DeviceItem from "../Components/DeviceItem";
import InputField from "../Components/InputField";
import glass from "../Images/glass-brown.svg";
import plus from "../Images/plus-circle-green.svg";
import refresh from "../Images/refresh-gray.svg";
import Account from "./Account";
import AddDevice from './AddDevice';

export default function Settings({setSettingsToggle, addDeviceToggel, setAddDeviceToggle, setConnectDeviceToggle, handlePlantPalClick, handleRefreshClick, devices, lastLog, device, setDevice, refreshDate, handleLogout, settingsToggle, connectDeviceToggle, user, setUser}) {

    const handleAddDeviceClick = () => {
        setAddDeviceToggle(true);
    }

    const handleSettingsClick = () => {
        setAddDeviceToggle(false);
        setSettingsToggle(true);
    }

    return (
        
        <div className='dashboard-grid-settings'>

            <div className='dashboard-header'>
                <div className="dashboard-header-logo grow" onClick={handlePlantPalClick}>
                    <img src={plantpal_logo} alt="PlantPal main logo"></img>
                    <h1>PlantPal</h1>
                </div>
                <div className="dashboard-header-links">
                    {settingsToggle? <></> : <li><h4 className="last-refresh">{refreshDate}</h4></li> }
                    {settingsToggle? <></> : <li><img className="refresh grow" src={refresh} alt="Refresh logo" onClick={handleRefreshClick}></img></li>}
                    <li><img className="gear grow" src={gear} alt="Gear logo" onClick={handleSettingsClick}></img></li>
                    <li><img className="exit grow" src={exit} alt="Exit logo" onClick={handleLogout}></img></li>
                </div>
            </div>

            <div className='dashboard-menu'>

                <h2 className='menu-txt'>Devices</h2>
                
                <div className='menu-options'>
                    <InputField inputImg={glass} isRequired={false} type='text' placeholder='Search' isSpellCheck={false} setWidth={'100%'}></InputField>
                    <img src={plus} alt='Plus Icon' className='add-device grow' onClick={handleAddDeviceClick}></img>
                </div>

                <div className='devices'>
                    
                    <ul className='device-list'>
                        
                        { devices.map((devices, index) => <DeviceItem key={devices.device_id} devices={devices} index={index} setDevice={setDevice} device={device} setAddDeviceToggle={setAddDeviceToggle} setSettingsToggle={setSettingsToggle} from="Settings" settingsToggle={settingsToggle} connectDeviceToggle={connectDeviceToggle}></DeviceItem>)}

                    </ul>
                    
                </div>

            </div>

            <div className='dashboard-setting'>
                
                {addDeviceToggel? <AddDevice setConnectDeviceToggle={setConnectDeviceToggle} setSettingsToggle={setSettingsToggle} setAddDeviceToggle={setAddDeviceToggle} handleRefreshClick={handleRefreshClick} setDevice={setDevice}></AddDevice>:<Account setUser={setUser} user={user}></Account>}

            </div>

        </div>
    );
}