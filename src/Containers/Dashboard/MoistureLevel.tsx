import React, {useState, useEffect} from 'react';
import triangle from "../../Images/triangle-orange.svg";
import { useDevice } from '../../Provider/DeviceProvider';
import WedgeGauge from '../../Components/WedgeGauge/WedgeGauge';
import './MoistureLevel.css';


export default function MoistureLevel() {

    const [moistureLevel, setMoistureLevel] = useState(0);
    const [isMoistureVisible, setIsMoistureVisible] = useState(false);
    const { devices, lastLog } = useDevice();
    const cap_max = 2000;
    const cap_min = 200;

    const formatMostureLevel = () => {
        if (lastLog && lastLog.soil_cap) {
            const formatCap = ( lastLog.soil_cap - cap_min) / (cap_max - cap_min) * 100;
            setMoistureLevel(formatCap);
        }
    };

    useEffect(() => {
        setIsMoistureVisible(devices.length > 0);
    }, [devices]);

    useEffect(() => {
        formatMostureLevel();
    }, [lastLog]);

    return (
        <div className={`dashboard-moisture ${isMoistureVisible ? '' : 'hidden'}`}>
            <h3>Plant Moisture Level</h3>

            {!lastLog ? (
                <div className='start-moisture'>
                    <img src={triangle} alt='Connection icon' />
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