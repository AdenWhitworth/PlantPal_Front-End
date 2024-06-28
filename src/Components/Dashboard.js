import React from 'react';
import plantpal_logo from "../Images/PlantPal Logo.svg";
import gear from "../Images/gear-grey.svg";
import exit from "../Images/exit-grey.svg";
import DeviceItem from "../Components/DeviceItem";
import InputField from "../Components/InputField";
import glass from "../Images/glass-brown.svg";
import plus from "../Images/plus-circle-green.svg";
import x_circle from "../Images/x-circle-red.svg";
import check_circle from "../Images/check-circle-green.svg";
import traingle from "../Images/triangle-orange.svg";
import wifi from "../Images/wifi-green.svg";


import { Gauge, gaugeClasses  } from '@mui/x-charts/Gauge';

export default function Dashboard({}) {

    return (
        <section className="dashboard">
            <div className='dashboard-grid'>

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

                <div className='dashboard-moisture'>
                    
                    <h3>Plant Moisture Level</h3>

                    <div className='moisture-gauge'>
                        <Gauge
                            className='moisture-gauge'
                            value={40}
                            startAngle={-90}
                            endAngle={90}
                            innerRadius="60%"
                            outerRadius="100%"
                            cornerRadius="20%"
                            sx={{
                                [`& .${gaugeClasses.valueText}`]: {
                                    display: 'none',
                                },
                                [`& .${gaugeClasses.valueArc}`]: {
                                    fill: '#C1E899',
                                },
                                [`& .${gaugeClasses.referenceArc}`]: {
                                    fill: '#D9D9D9',
                                },
                            }}
                        />
                    </div>

                    <div className='moisture-labels'>
                        <h4>Dry</h4>
                        <h4>Wet</h4>
                    </div>
                    
                </div>

                <div className='dashboard-connection'>
                    
                    <h3>Connection</h3>
                    <img src={traingle} alt='Connection icon'></img>
                    <h4>Missing</h4>
                    <h4>SSID: WhitHome</h4>
                    <button className='text-btn'><span>Change Wifi?</span></button>
                    
                </div>

                <div className='dashboard-status'>
                    <h3>Water Status</h3>

                    <div className='status-indicator'>
                        <img src={x_circle} alt='Status icon'></img>
                        <h3>Needs Water</h3>
                    </div>
                </div>
                <div className='dashboard-automate'></div>
            </div>
        </section>
    );
}