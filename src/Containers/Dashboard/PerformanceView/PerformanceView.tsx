import React from 'react';
import MoistureLevel from './MoistureLevel/MoistureLevel';
import WifiConnection from './WifiConnection/WifiConnection';
import WaterStatus from './WaterStatus/WaterStatus';
import AutoManualWater from './AutoManualWater/AutoManualWater';

interface PerformanceViewProps {
    setConnectDeviceToggle: (value: boolean) => void;
    handleRefreshClick: () => void; 
    autoSwitch: boolean; 
    setAutoSwitch: (value: boolean) => void;
    setConfirmAuto: (value: boolean) => void;
}

export default function PerformanceView({
    handleRefreshClick,  
    setConnectDeviceToggle, 
    autoSwitch, 
    setAutoSwitch, 
    setConfirmAuto, 
}: PerformanceViewProps) {

    return (
        <>
            <MoistureLevel></MoistureLevel>

            <WifiConnection 
                setConnectDeviceToggle={setConnectDeviceToggle}
                handleRefreshClick={handleRefreshClick}
            ></WifiConnection>

            <WaterStatus></WaterStatus>

            <AutoManualWater 
                autoSwitch={autoSwitch} 
                setAutoSwitch={setAutoSwitch} 
                setConfirmAuto={setConfirmAuto}
            ></AutoManualWater>
        </>
    );
}