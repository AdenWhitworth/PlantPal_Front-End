import React, { useState, useEffect } from 'react';
import plantpal_logo from "../Images/PlantPal Logo.svg";
import gear from "../Images/gear-grey.svg";
import exit from "../Images/exit-grey.svg";
import DeviceItem from "../Components/DeviceItem";
import InputField from "../Components/InputField";
import glass from "../Images/glass-brown.svg";
import plus from "../Images/plus-circle-green.svg";
import x_circle from "../Images/x-circle-red.svg";
//import check_circle from "../Images/check-circle-green.svg";
import traingle from "../Images/triangle-orange.svg";
//import wifi from "../Images/wifi-green.svg";
import refresh from "../Images/refresh-gray.svg";
import tap from "../Images/tap-green.svg";
import { Gauge, gaugeClasses  } from '@mui/x-charts/Gauge';
import { BarChart  } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from "../Components/Button";
import { useAuth} from "../Provider/authProvider";
import { useNavigate } from "react-router-dom";
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

const dataset = [
    {
        times: 4,
        date: '6/30/2024',
    },
    {
        times: 2,
        date: '6/29/2024',
    },
    {
        times: 3,
        date: '6/28/2024',
    },
    {
        times: 1,
        date: '6/27/2024',
    },
    {
        times: 4,
        date: '6/26/2024',
    },
    {
        times: 2,
        date: '6/25/2024',
    },
    {
        times: 3,
        date: '6/24/2024',
    },
    {
        times: 1,
        date: '6/23/2024',
    },
  ];

export default function PerformanceView({setSettingsToggle, setAddDeviceToggle, setUser}) {

    const [autoSwitch, setAutoSwitch] = useState(false);
    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState({});
    const [deviceLogs, setDeviceLogs] = useState([]);
    const [lastLog, setLastLog] = useState({});
    const [moistureLevel, setMoistureLevel] = useState(0);

    const navigate = useNavigate();
    const { clearToken, token } = useAuth();

    const client = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        
        headers: {
            "Authorization": "Bearer " + token
        }
        
    });

    const handleLogout = () => {
        clearToken();
        navigate("/auth", { replace: true });
    };

    const handleAutoSwitch = (e) => {
        setAutoSwitch(e.target.checked);
    };

    const handleSettingsClick = () => {
        setSettingsToggle(true);
    }

    const handleAddDeviceClick = () => {
        setAddDeviceToggle(true);
        setSettingsToggle(true);
    }

    const handlePlantPalClick = () => {
        navigate('/', {
            replace: true,
        });
    }

    const fetchUserDevices = async () => {
        try {
            const response = await client.get("/dashboard/userDevices");

            setDevices(response.data.devices);
            
        } catch (error) {
            clearToken();
            navigate("/auth", { replace: true });
        }
    }

    const handleRefreshClick = () => {
        fetchUserDevices();
    }

    const fethDeviceLogs = async () => {
        try {
            const response = await client.get("/dashboard/deviceLogs", { params: {cat_num: device.cat_num}});

            setDeviceLogs(response.data.deviceLogs);
            setLastLog(response.data.lastLog);
            
        } catch (error) {
            clearToken();
            navigate("/auth", { replace: true });
        }
    }

    const formatMostureLevel = () => {
        const cap_max = 2000;
        const cap_min = 200;

        var formatCap = ( lastLog.soil_cap - cap_min) / (cap_max - cap_min) * 100;
        setMoistureLevel(formatCap);
    }

    useEffect(() => {
        fetchUserDevices();
    }, [device]);

    useEffect(() => {
        if(typeof device !== "undefined"){
            fethDeviceLogs();
        }
    }, [device]);

    useEffect(() => {
        if(typeof lastLog !== "undefined"){
            formatMostureLevel();
        }
    }, [lastLog]);

    return (
        
        <div className='dashboard-grid'>

            <div className='dashboard-header'>
                <div className="dashboard-header-logo grow" onClick={handlePlantPalClick}>
                    <img src={plantpal_logo} alt="PlantPal main logo"></img>
                    <h1>PlantPal</h1>
                </div>
                <div className="dashboard-header-links">
                    <li><img className="refresh grow" src={refresh} alt="Refresh logo" onClick={handleRefreshClick}></img></li>
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
                        
                        { devices.map((devices, index) => <DeviceItem key={devices.device_id} devices={devices} index={index} setDevice={setDevice} device={device}></DeviceItem>)}

                    </ul>
                    
                </div>

            </div>

            <div className='dashboard-moisture'>
                
                <h3>Plant Moisture Level</h3>

                {(typeof lastLog === "undefined")?
                    <div className='start-moisture'>
                        <img src={traingle} alt='Connection icon'></img>
                        <h4>Connect PlantPal to get first moisture level</h4>
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
            <div className='dashboard-automate'>
                <h3>Automate Watering</h3>

                <FormControlLabel
                    control={<IOSSwitch sx={{ m: 1 }} checked={autoSwitch} onChange={handleAutoSwitch} />}
                    label={autoSwitch? "Auto": "Manual"}
                />

                {autoSwitch?
                    <div className='auto'>
                        
                        <BarChart
                            dataset={dataset}
                            xAxis={[
                                { scaleType: 'band', dataKey: 'date', tickPlacement:'middle', tickLabelPlacement:'middle'},
                            ]}
                            {...chartSetting}
                            borderRadius={5}
                        />
                        
                    </div>
                    :
                    <div className='manual'>
                        
                        <img src={tap} alt='Tap Icon'></img>
                        <Button className='manual-btn' children='Pump Water' isPrimaryStyle={false} onClick={() => {console.log("clicked")}} ></Button>
                            
                    </div>
                    
                    
                }

            </div>
        </div>
        
    );
}