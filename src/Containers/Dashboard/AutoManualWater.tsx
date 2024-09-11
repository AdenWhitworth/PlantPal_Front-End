import React, {useState, useEffect} from 'react';
import traingle from "../../Images/triangle-orange.svg";
import ToggleSwitch from '../../Components/ToggleSwitch';
import Auto from './Auto';
import Manual from './Manual';
import { useSocket } from '../../Provider/SocketProvider';
import { useDevice } from '../../Provider/DeviceProvider';
import {useAuth} from '../../Provider/AuthProvider';
import { useSettingsHandlers } from '../../Hooks/useSettingsHandlers';
import './AutoManualWater.css';

interface AutoManualWaterProps {
    autoSwitch: boolean;
    setAutoSwitch: (value: boolean) => void;
    setConfirmAuto: (value: boolean) => void;
}
  
interface WaterOccurrence {
    date: string;
    times: number;
}

export default function AutoManualWater({
    autoSwitch, 
    setAutoSwitch, 
    setConfirmAuto
}: AutoManualWaterProps) {

    const [waterOccurance, setWaterOccurance] = useState<WaterOccurrence[]>([]);
    const [isAutoVisible, setIsAuotVisible] = useState<boolean>(false);
    const { setRefresh } = useSocket();
    const { accessToken, setAccessToken } = useAuth();
    const { handleUpdatePumpWater, error, resetError} = useSettingsHandlers();
    const { 
        devices, 
        lastLog, 
        device, 
        deviceLogs
    } = useDevice();

    const handleAutoSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAutoSwitch(e.target.checked);
        setConfirmAuto(true);
    };

    const handleUpdatePumpWaterClick = async () => {
        if (!device || !device.device_id) {
          console.error('Device is not available');
          return;
        }

        handleUpdatePumpWater(accessToken, setAccessToken, {
            device_id: device.device_id, 
            pump_water: true
        }, () => {
            setRefresh(true);
        });
    };

    const countWaterOccurances = () => {
        const now = new Date();
        const sevenDaysAgo = new Date(now);
        sevenDaysAgo.setDate(now.getDate() - 7);

        const dateCount = deviceLogs.reduce<Record<string,number>>((acc, log) => {
            const logDate = new Date(log.log_date);
            if (logDate >= sevenDaysAgo && logDate <= now && log.water === 1) {
                const dayDate = logDate.toISOString().split('T')[0];
                acc[dayDate] = (acc[dayDate] || 0) + 1;
            }
            return acc;
        }, {});

        const occuranceArray = Object.entries(dateCount).map(([date, times]) => ({ date, times })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

                <img className='auto-triangle' src={ traingle} alt='Auto Error icon'></img>
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
                        <Manual handleUpdatePumpWaterClick={handleUpdatePumpWaterClick}></Manual>
                    }
                    
                </div>
            }
        </div>
    );
}