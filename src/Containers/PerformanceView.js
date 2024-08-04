import React, { useState, useEffect } from 'react';
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
import refresh from "../Images/refresh-gray.svg";
import tap from "../Images/tap-green.svg";
import wifi_logo from '../Images/wifi-brown.svg';
import lock from '../Images/lock-brown.svg';
import time from '../Images/time-green.svg';
import { Gauge, gaugeClasses  } from '@mui/x-charts/Gauge';
import { BarChart  } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import {useAuth} from '../Provider/authProvider';
import { useSocket } from '../Provider/SocketProvider';
import axios from "axios";

const IOSSwitch = styled((props) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    '& .MuiSwitch-switchBase': {
      padding: 0,
      margin: 2,
      transitionDuration: '300ms',
      '&.Mui-checked': {
        transform: 'translateX(16px)',
        color: '#fff',
        '& + .MuiSwitch-track': {
          backgroundColor: theme.palette.mode === 'dark' ? '#C1E899' : '#C1E899',
          opacity: 1,
          border: 0,
        },
        '&.Mui-disabled + .MuiSwitch-track': {
          opacity: 0.5,
        },
      },
      '&.Mui-focusVisible .MuiSwitch-thumb': {
        color: '#33cf4d',
        border: '6px solid #fff',
      },
      '&.Mui-disabled .MuiSwitch-thumb': {
        color:
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[600],
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
      },
    },
    '& .MuiSwitch-thumb': {
      boxSizing: 'border-box',
      width: 22,
      height: 22,
    },
    '& .MuiSwitch-track': {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
      opacity: 1,
      transition: theme.transitions.create(['background-color'], {
        duration: 500,
      }),
    },
}));

const valueFormatter = (value) => `${value}x`;

const chartSetting = {
  yAxis: [
    {
      label: 'Times Watered',
    },
  ],
  series: [{ dataKey: 'times', valueFormatter, color:'#C1E899'}],
  sx: {
    [`& .${axisClasses.directionY} .${axisClasses.label}`]: {
      transform: 'translateX(-10px)',
    },
  },
};

export default function PerformanceView({setSettingsToggle, setAddDeviceToggle, handlePlantPalClick, handleRefreshClick, devices, lastLog, device, setDevice, refreshDate, handleLogout, settingsToggle, setConnectDeviceToggle, deviceLogs, connectDeviceToggle, autoSwitch, setAutoSwitch, setConfirmAuto}) {

    const [moistureLevel, setMoistureLevel] = useState(0);
    const [waterStatus, setWaterStatus] = useState("");
    const [waterStatusCSS, setWaterStatusCSS] = useState("good-water");
    const [waterStatusImg, setWaterStatusImg] = useState("");
    const [moistureCSS, setMoistureCSS] = useState("dashboard-moisture hidden");
    const [connectionCSS, setConnectionCSS] = useState("dashboard-connection hidden");
    const [statusCSS, setStatusCSS] = useState("dashboard-status hidden");
    const [automateCSS, setAutomateCSS] = useState("dashboard-automate hidden");
    const [updateWifiToggle, setUpdateWifiToggle] = useState(false);
    const [wifiSSID, setWifiSSID] = useState('');
    const [wifiPassword, setWifiPassword] = useState('');
    const [error, setError] = useState('Error');
    const [errorCSS, setErrorCSS] = useState('error-message hidden');
    const [searchItem, setSearchItem] = useState('');
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [waterOccurance, setWaterOccurance] = useState([]);
    const { token } = useAuth();
    const { setRefresh} = useSocket();
    
    const client = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        
        headers: {
            "Authorization": "Bearer " + token
        }
        
    });

    const handleAutoSwitch = (e) => {
        setAutoSwitch(e.target.checked);
        setConfirmAuto(true);
    };

    const handleSettingsClick = () => {
        setSettingsToggle(true);
    }

    const handleAddDeviceClick = () => {
        setAddDeviceToggle(true);
        setSettingsToggle(true);
    }

    const formatMostureLevel = () => {
        const cap_max = 2000;
        const cap_min = 200;

        var formatCap = ( lastLog.soil_cap - cap_min) / (cap_max - cap_min) * 100;
        setMoistureLevel(formatCap);
    }

    const formatWaterStatus = () => {
        const cap_target = 600;

        const status_images = {
            bad_water: x_circle,
            good_water: check_circle,
            error_water: traingle
        }

        if(typeof lastLog === "undefined"){
            setWaterStatusImg(status_images.error_water);
            setWaterStatusCSS("good-water");
            setWaterStatus("");
            return
        }

        if (lastLog.soil_cap > cap_target){
            setWaterStatusImg(status_images.good_water);
            setWaterStatusCSS("good-water");
            setWaterStatus("Sufficient Water");
        } else {
            setWaterStatusImg(status_images.bad_water);
            setWaterStatusCSS("bad-water");
            setWaterStatus("Needs Water");
        }

    }

    const handleChangeWifiClick = () => {
        setUpdateWifiToggle(true);
    }

    const handleUpdateWifi = async (e) => {
        e.preventDefault();

        try {
            await client.post("/dashboard/updateWifi", { device_id: device.device_id, wifi_ssid: wifiSSID, wifi_password: wifiPassword});
            setErrorCSS('error-message hidden');
            document.getElementById("update-wifi").reset();
            handleRefreshClick();
            setUpdateWifiToggle(false);
            setConnectDeviceToggle(true);
        } catch (error) {
            setError(error.response.data.msg);
            setErrorCSS('error-message');
        }  
    }

    const handleUpdatePumpWater = async (e) => {
        e.preventDefault();
        try {
            await client.post("/dashboard/updatePumpWater", { device_id: device.device_id, pump_water: true});
            setRefresh(true);
        } catch (error) {
            console.log(error);
        }  
    }

    const countWaterOccurances = () => {
        const dateCount = {};
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        if (deviceLogs.length === 0){
            return setWaterOccurance([]);
        }

        deviceLogs.filter(deviceLog => {
            const localLogDate = new Date(deviceLog.log_date);
            return localLogDate >= sevenDaysAgo && localLogDate <= now;
          }).forEach(deviceLog => {
            const localLogDate = new Date(deviceLog.log_date);
            const dayDate = localLogDate.toISOString().split('T')[0];
            if (deviceLog.water === 1){
                
                if(!dateCount[dayDate]){
                    dateCount[dayDate] = 0;
                }

                dateCount[dayDate]++;
            }
        });

        const occuranceArray = Object.keys(dateCount).map(date => ({
            times: dateCount[date],
            date: date,
        }));

        occuranceArray.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        setWaterOccurance(occuranceArray);
    }

    const handleSearchChange = (e) => {
        const searchTerm = e.target.value;
        setSearchItem(searchTerm);

        setFilteredDevices(devices.filter((device) => device.location.toLowerCase().includes(searchTerm.toLowerCase()) || device.cat_num.toLowerCase().includes(searchTerm.toLowerCase())));
    }

    useEffect(() => {
        setFilteredDevices(devices);
    },[devices]);

    useEffect(() => {
        setSearchItem('');
    },[device]);

    useEffect(() => {
        if(typeof lastLog !== "undefined"){
            formatMostureLevel();
        }
    }, [lastLog]);

    useEffect(() => {
        if (devices.length !== 0 ){
            setMoistureCSS("dashboard-moisture");
            setConnectionCSS("dashboard-connection");
            setStatusCSS("dashboard-status");
            setAutomateCSS("dashboard-automate");
        } else {
            setMoistureCSS("dashboard-moisture hidden");
            setConnectionCSS("dashboard-connection hidden");
            setStatusCSS("dashboard-status hidden");
            setAutomateCSS("dashboard-automate hidden");
        }
    }, [devices]);

    useEffect(() => {
        formatWaterStatus();
    }, [lastLog]);

    useEffect(() => {
        
        countWaterOccurances();
        
    }, [deviceLogs]);

    return (
        
        <div className='dashboard-grid'>
            <div className='dashboard-header'>
                <div className="dashboard-header-logo grow" onClick={handlePlantPalClick}>
                    <img src={plantpal_logo} alt="PlantPal main logo"></img>
                    <h1>PlantPal</h1>
                </div>
                <div className="dashboard-header-links">
                    <li><h4 className="last-refresh">{refreshDate}</h4></li>
                    <li><img className="refresh grow" src={refresh} alt="Refresh logo" onClick={handleRefreshClick}></img></li>
                    <li><img className="gear grow" src={gear} alt="Gear logo" onClick={handleSettingsClick}></img></li>
                    <li><img className="exit grow" src={exit} alt="Exit logo" onClick={handleLogout}></img></li>
                </div>
            </div>

            <div className='dashboard-menu'>

                <h2 className='menu-txt'>Devices</h2>
                
                <div className='menu-options'>
                    <InputField inputImg={glass} isRequired={false} type='text' placeholder='Search' isSpellCheck={false} setWidth={'100%'} value={searchItem} onChange={handleSearchChange}></InputField>
                    <img src={plus} alt='Plus Icon' className='add-device grow' onClick={handleAddDeviceClick}></img>
                </div>

                <div className='devices'>
                    
                    <ul className='device-list'>
                        
                        { filteredDevices.map((filteredDevices, index) => <DeviceItem key={filteredDevices.device_id} devices={filteredDevices} index={index} setDevice={setDevice} device={device} setAddDeviceToggle={setAddDeviceToggle} setSettingsToggle={setSettingsToggle} from="Performance" settingsToggle={settingsToggle} connectDeviceToggle={connectDeviceToggle}></DeviceItem>)}

                    </ul>
                    
                </div>

            </div>
            
            <div className={moistureCSS}>
                
                <h3>Plant Moisture Level</h3>

                {(typeof lastLog === "undefined")?
                    <div className='start-moisture'>
                        <img src={traingle} alt='Connection icon'></img>
                        <h4>Connect PlantPal to get first moisture level reading.</h4>
                    </div>
                    :
                    <div className='show-moisture'>
                        <div className='moisture-gauge'>
                            <Gauge
                                className='moisture-gauge'
                                value={moistureLevel}
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
                }
            </div>

            <div className={connectionCSS}>
                
                {updateWifiToggle?
                
                    <form id='update-wifi' className='update-wifi' onSubmit={handleUpdateWifi}>
                        <h3>Connection</h3>
                        <InputField onChange={(e) => setWifiSSID(e.target.value)} inputImg={wifi_logo} isRequired={true} type='text' placeholder='Wifi SSID' isSpellCheck={false} setWidth={'60%'}></InputField>
                        <InputField onChange={(e) => setWifiPassword(e.target.value)} inputImg={lock} isRequired={true} type='password' placeholder='Wifi Password' isSpellCheck={false} setWidth={'60%'}></InputField>
                        <button type='submit' className='text-btn padded'><span>Connect Wifi?</span></button>
                        <h4 className={errorCSS}>{error}</h4>
                    </form>
                    :
                    <div>
                        <h3>Connection</h3>
                        <img src={device.shadow_connection? wifi : traingle} alt='Connection icon'></img>
                        <h4>{device.shadow_connection? "Connected": "Missing"}</h4>
                        <h4>SSID: {device.wifi_ssid}</h4>
                        <button className='text-btn' onClick={handleChangeWifiClick}><span>Change Wifi?</span></button>
                    </div>
                }
                
            </div>

            <div className={statusCSS}>
                <h3>Water Status</h3>

                <div className='status-indicator'>
                    <img src={waterStatusImg} alt='Status icon'></img>
                    <h3 className={waterStatusCSS}>{waterStatus}</h3>
                </div>
            </div>

            <div className={automateCSS}>
                <h3>Automate Watering</h3>

                {(typeof lastLog === "undefined")?

                    <img src={ traingle} alt='Auto Error icon'></img>
                    :
                
                    <div className='auto-status'>
                        
                        <FormControlLabel
                            control={<IOSSwitch sx={{ m: 1 }} checked={autoSwitch} onChange={handleAutoSwitch} />}
                            label={autoSwitch? "Auto": "Manual"}
                        />

                        {autoSwitch?
                            <div className='auto'>
                                
                                <BarChart
                                    dataset={waterOccurance}
                                    xAxis={[
                                        { scaleType: 'band', dataKey: 'date', tickPlacement:'middle', tickLabelPlacement:'middle'},
                                    ]}
                                    {...chartSetting}
                                    borderRadius={5}
                                />
                                
                            </div>
                            :
                            <div className='manual'>
                                <div className='manual-tap'>
                                    {device.pump_water? 
                                        <img className='flip-image' src={time} alt='Time Icon'></img>
                                        :
                                        <img onClick={handleUpdatePumpWater} className='grow' src={tap} alt='Tap Icon'></img>
                                    } 
                                </div>
                                <h4>Pump Water</h4>
                            </div>
                        }
                        
                    </div>
                }
            </div>
            
        </div>
        
    );
}