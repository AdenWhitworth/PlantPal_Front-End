import React from 'react';
import MoistureLevel from './MoistureLevel/MoistureLevel';
import WifiConnection from './WifiConnection/WifiConnection';
import WaterStatus from './WaterStatus/WaterStatus';
import AutoManualWater from './AutoManualWater/AutoManualWater';
import { PerformanceViewProps } from './PerformanceViewTypes';

/**
 * PerformanceView component that displays various device-related statuses and settings, 
 * including moisture level, WiFi connection, water status, and manual/automatic water control.
 * 
 * @component
 * @param {PerformanceViewProps} props - The component props.
 * @returns {JSX.Element} The rendered component displaying various performance indicators and controls.
 */
export default function PerformanceView({
    handleRefreshClick,  
    setConnectDeviceToggle, 
    setConfirmAuto, 
}: PerformanceViewProps): JSX.Element {

    return (
        <>
            <MoistureLevel></MoistureLevel>

            <WifiConnection 
                setConnectDeviceToggle={setConnectDeviceToggle}
                handleRefreshClick={handleRefreshClick}
            ></WifiConnection>

            <WaterStatus></WaterStatus>

            <AutoManualWater
                setConfirmAuto={setConfirmAuto}
            ></AutoManualWater>
        </>
    );
}