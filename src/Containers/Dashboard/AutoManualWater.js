import React, {useState, useEffect} from 'react';
import traingle from "../../Images/triangle-orange.svg";
import ToggleSwitch from '../../Components/ToggleSwitch';
import Auto from './Auto';
import Manual from './Manual';
import { useSocket } from '../../Provider/SocketProvider';
import { useDevice } from '../../Provider/DeviceProvider';
import {useAuth} from '../../Provider/AuthProvider';
import { postUpdatePumpWater } from '../../Services/ApiService';

export default function AutoManualWater({
    autoSwitch, 
    setAutoSwitch, 
    setConfirmAuto
}) {

    const [waterOccurance, setWaterOccurance] = useState([]);
    const [isAutoVisible, setIsAuotVisible] = useState(false);
    const { setRefresh } = useSocket();
    const { token } = useAuth();
    const { 
        devices, 
        lastLog, 
        device, 
        deviceLogs
    } = useDevice();

    const handleAutoSwitch = (e) => {
        setAutoSwitch(e.target.checked);
        setConfirmAuto(true);
    };

    const handleUpdatePumpWater = async (e) => {
        e.preventDefault();
        try {
            await postUpdatePumpWater(token,{ device_id: device.device_id, pump_water: true})
            setRefresh(true);
        } catch (error) {
            console.error(error);
        }  
    }

    const countWaterOccurances = () => {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        const dateCount = deviceLogs.reduce((acc, log) => {
            const logDate = new Date(log.log_date);
            if (logDate >= sevenDaysAgo && logDate <= now && log.water === 1) {
                const dayDate = logDate.toISOString().split('T')[0];
                acc[dayDate] = (acc[dayDate] || 0) + 1;
            }
            return acc;
        }, {});

        const occuranceArray = Object.entries(dateCount).map(([date, times]) => ({ date, times })).sort((a, b) => new Date(b.date) - new Date(a.date));
        setWaterOccurance(occuranceArray);
    };

    useEffect(() => {
        setIsAuotVisible(devices.length > 0);
    }, [devices]);

    useEffect(() => {
        countWaterOccurances();
    }, [deviceLogs]);

    return (
        <div className={`dashboard-automate ${isAutoVisible ? '' : 'hidden'}`}>
            <h3>Automate Watering</h3>

            {!lastLog?

                <img src={ traingle} alt='Auto Error icon'></img>
                :
            
                <div className='auto-status'>

                    <ToggleSwitch 
                        checked={autoSwitch} 
                        onChange={handleAutoSwitch} 
                        label={autoSwitch? "Auto": "Manual"}
                    ></ToggleSwitch>

                    {autoSwitch?
                        <Auto waterOccurance={waterOccurance}></Auto>
                        :
                        <Manual handleUpdatePumpWater={handleUpdatePumpWater}></Manual>
                    }
                    
                </div>
            }
        </div>
    );
}