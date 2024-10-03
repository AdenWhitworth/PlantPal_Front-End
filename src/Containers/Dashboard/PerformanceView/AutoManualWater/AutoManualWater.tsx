import React, {useState, useEffect, useCallback} from 'react';
import traingle from "../../../../Images/triangle-orange.svg";
import ToggleSwitch from '../../../../Components/ToggleSwitch/ToggleSwitch';
import Auto from './Auto/Auto';
import Manual from './Manual/Manual';
import { useSocket } from '../../../../Provider/SocketProvider/SocketProvider';
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';
import {useAuth} from '../../../../Provider/AuthProvider/AuthProvider';
import { useSettingsHandlers } from '../../../../Hooks/useSettingsHandlers/useSettingsHandlers';
import './AutoManualWater.css';
import { AutoManualWaterProps, WaterOccurrence } from './AutoManualWaterTypes';
import LoadingDots from '../../../../Components/LoadingDots/LoadingDots';

/**
 * Component for managing automatic and manual watering settings.
 * 
 * @component
 * @param {AutoManualWaterProps} props - The props for the component.
 * @returns {JSX.Element} The rendered component.
 */
export default function AutoManualWater({ 
    setConfirmAuto
}: AutoManualWaterProps): JSX.Element {

    const [waterOccurance, setWaterOccurance] = useState<WaterOccurrence[]>([]);
    const [isAutoVisible, setIsAuotVisible] = useState<boolean>(false);
    const { setRefreshShadow } = useSocket();
    const { accessToken, setAccessToken } = useAuth();
    const { handleUpdatePumpWater } = useSettingsHandlers();
    const { 
        devices, 
        lastLog, 
        device, 
        deviceLogs,
        deviceShadow
    } = useDevice();

    /**
     * Handles the change of the auto switch.
     * Confirms the new setting with a modal.
     * 
     * @function
     * @param {React.ChangeEvent<HTMLInputElement>} e - The change event from the toggle switch.
     */
    const handleAutoSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConfirmAuto(true);
    };

    /**
     * Handles the click event for updating the pump water.
     * If the device is available, it calls the update function.
     * 
     * @function
     */
    const handleUpdatePumpWaterClick = async () => {
        if (!device || !device.device_id) {
          console.error('Device is not available');
          return;
        }

        handleUpdatePumpWater(accessToken, setAccessToken, {
            device_id: device.device_id, 
            pump_water: true
        }, () => {
            setRefreshShadow(true);
        });
    };

    /**
     * Counts the occurrences of watering events in the last seven days
     * and updates the state with the results.
     * 
     * @function
     */
    const countWaterOccurances = useCallback(() => {
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
    }, [deviceLogs]);
    
    /**
     * Effect to determine if the auto settings should be visible based on device presence.
     */
    useEffect(() => {
        setIsAuotVisible(devices.length > 0);
    }, [devices]);

    /**
     * Effect to count watering occurrences whenever device logs change.
     */
    useEffect(() => {
        countWaterOccurances();
    }, [deviceLogs, countWaterOccurances]);

    return (
        <div className={`dashboard-automate ${isAutoVisible ? '' : 'hidden'}`}>
            <h3>Automate Watering</h3>

            {!lastLog?

                <img className='auto-triangle' src={ traingle} alt='Auto Error icon'></img>
                :
            
                <div className='auto-status'>
                    
                    <ToggleSwitch 
                        checked={!!deviceShadow?.state?.reported?.auto} 
                        onChange={handleAutoSwitch} 
                        label={deviceShadow?.state?.reported?.auto? "Auto": "Manual"}
                    ></ToggleSwitch>

                    {(deviceShadow?.state?.desired?.auto === deviceShadow?.state?.reported?.auto)?
                        (!!deviceShadow?.state?.reported?.auto? 
                            <Auto waterOccurance={waterOccurance}></Auto> 
                            : 
                            <Manual handleUpdatePumpWaterClick={handleUpdatePumpWaterClick}></Manual>
                        )
                        :
                        <LoadingDots />
                    }

                </div>
            }
        </div>
    );
}