import React from 'react';
import MoistureLevel from './MoistureLevel';
import WifiConnection from './WifiConnection';
import WaterStatus from './WaterStatus';
import AutoManualWater from './AutoManualWater';

export default function PerformanceView({
    handleRefreshClick,  
    setConnectDeviceToggle, 
    autoSwitch, 
    setAutoSwitch, 
    setConfirmAuto, 
}) {

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