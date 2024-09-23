import React, {useState, useEffect, useCallback} from 'react';
import triangle from "../../../../Images/triangle-orange.svg";
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';
import WedgeGauge from '../../../../Components/WedgeGauge/WedgeGauge';
import './MoistureLevel.css';

/**
 * Component that displays the moisture level of plants.
 *
 * The moisture level is calculated based on the soil capacitance values
 * received from the last log. The component conditionally displays a
 * connection prompt if no logs are available, or a moisture gauge
 * if logs are present.
 *
 * @component
 * @returns {JSX.Element} The rendered Manual component.
 */
export default function MoistureLevel(): JSX.Element {

    const [moistureLevel, setMoistureLevel] = useState<number>(0);
    const [isMoistureVisible, setIsMoistureVisible] = useState<boolean>(false);
    const { devices, lastLog } = useDevice();
    const cap_max = 2000; // Maximum capacitance value of the sensor.
    const cap_min = 200;  // Minimum capacitance value of the sensor.

    /**
     * Formats the moisture level based on the last log's soil capacitance.
     * Sets the moisture level as a percentage relative to the defined
     * maximum and minimum capacitance values.
     *
     * @function
     */
    const formatMoistureLevel = useCallback(() => {
        if (lastLog && lastLog.soil_cap) {
            const formatCap = (lastLog.soil_cap - cap_min) / (cap_max - cap_min) * 100;
            setMoistureLevel(formatCap);
        }
    }, [lastLog, cap_min, cap_max]);

    /**
     * Effect hook that determines if moisture level should be visible
     * based on the presence of devices.
     */
    useEffect(() => {
        setIsMoistureVisible(devices.length > 0);
    }, [devices]);

    /**
     * Effect hook that formats the moisture level whenever the last log
     * changes.
     */
    useEffect(() => {
        formatMoistureLevel();
    }, [lastLog, formatMoistureLevel]);

    return (
        <div className={`dashboard-moisture ${isMoistureVisible ? '' : 'hidden'}`}>
            <h3>Plant Moisture Level</h3>

            {!lastLog ? (
                <div className='start-moisture'>
                    <img src={triangle} alt='Connection icon triangle' />
                    <h4>Connect PlantPal to get first moisture level reading.</h4>
                </div>
            ) : (
                <div className='show-moisture'>
                    <div className='moisture-gauge'>
                        <WedgeGauge className='moisture-gauge' value={moistureLevel}></WedgeGauge>
                    </div>

                    <div className='moisture-labels'>
                        <h4>Dry</h4>
                        <h4>Wet</h4>
                    </div>
                </div>
            )}
        </div>
    );
}