import React from 'react';
import plantpal_logo from "../Images/PlantPal Logo.svg";
import gear from "../Images/gear-grey.svg";
import exit from "../Images/exit-grey.svg";
import DeviceItem from "../Components/DeviceItem";
import InputField from "../Components/InputField";
import glass from "../Images/glass-brown.svg";
import plus from "../Images/plus-circle-green.svg";

export default function Settings({setSettingsToggle}) {

    const handleSettingsUnclick = () => {
        setSettingsToggle(false);
    }

    return (
        
        <div className='dashboard-grid-settings'>

            <div className='dashboard-header'>
                <div className="dashboard-header-logo grow">
                    <img src={plantpal_logo} alt="PlantPal main logo"></img>
                    <h1>PlantPal</h1>
                </div>
                <div className="dashboard-header-links">
                    <li><img className="gear grow" src={gear} alt="Gear logo"></img></li>
                    <li><img className="exit grow" src={exit} alt="Exit logo"></img></li>
                </div>
            </div>

            <div className='dashboard-menu'>

                <h2 className='menu-txt'>Devices</h2>
                
                <div className='menu-options'>
                    <InputField inputImg={glass} isRequired={false} type='text' placeholder='Search' isSpellCheck={false} setWidth={'100%'}></InputField>
                    <img src={plus} alt='Plus Icon' className='add-device grow'></img>
                </div>

                <div className='devices'>
                    
                    <ul className='device-list'>
                        <li>
                            <div className="device-line selected" onClick={handleSettingsUnclick}>
                                <h4 className="device-identifier">Kitchen-1: A5D1CJ</h4>
                            </div>
                        </li>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                        <DeviceItem></DeviceItem>
                    </ul>
                    
                </div>

            </div>

            <div className='dashboard-setting'>
                
            </div>

        </div>
    );
}