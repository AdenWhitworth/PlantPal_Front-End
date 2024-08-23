import React, { useState, useEffect } from 'react';
import MoistureLevel from './MoistureLevel';
import WifiConnection from './WifiConnection';
import WaterStatus from './WaterStatus';
import AutoManualWater from './AutoManualWater';
import DeviceMenu from './DeviceMenu';
import DashboardHeader from './DashboardHeader';

export default function PerformanceView({
    settingsToggle, 
    setSettingsToggle, 
    handlePlantPalClick, 
    handleRefreshClick, 
    handleLogout, 
    setConnectDeviceToggle, 
    autoSwitch, 
    setAutoSwitch, 
    setConfirmAuto, 
    connectDeviceToggle, 
    setAddDeviceToggle
}) {

    return (
        
        <div className='dashboard-grid'>
            
            <DashboardHeader 
                handlePlantPalClick={handlePlantPalClick} 
                handleRefreshClick={handleRefreshClick} 
                handleLogout={handleLogout}
                setSettingsToggle={setSettingsToggle}
            ></DashboardHeader>

            <DeviceMenu 
                settingsToggle={settingsToggle} 
                setSettingsToggle={setSettingsToggle} 
                connectDeviceToggle={connectDeviceToggle} 
                setAddDeviceToggle={setAddDeviceToggle}
            ></DeviceMenu>
            
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
        </div>
        
    );
}