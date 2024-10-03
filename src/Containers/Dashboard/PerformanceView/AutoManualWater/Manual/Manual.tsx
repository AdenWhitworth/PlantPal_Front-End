import React from 'react';
import tap from "../../../../../Images/tap-green.svg";
import tap_locked from "../../../../../Images/tap-gray.svg";
import time from '../../../../../Images/time-green.svg';
import { useDevice } from '../../../../../Provider/DeviceProvider/DeviceProvider';
import './Manual.css';
import { ManualProps } from './ManualTypes';

/**
 * Manual component for managing pump water operations.
 *
 * @component
 * @param {ManualProps} props - The props for the Manual component.
 * @returns {JSX.Element} The rendered Manual component.
 */
export default function Manual({
    handleUpdatePumpWaterClick
}: ManualProps) {

    const { device, deviceShadow } = useDevice();

    return (
        <div className='manual'>
            <div className='manual-tap'>
                {deviceShadow?.state?.desired?.pump === false && deviceShadow?.state?.reported?.pump === false ?  (
                    device?.presence_connection ? (
                        <img onClick={handleUpdatePumpWaterClick} className='grow curser' src={tap} alt='Tap Icon'></img>
                        ) : (
                        <img src={tap_locked} alt='Tap Gray Icon'></img>
                    ))
                    :
                    ( deviceShadow?.state?.desired?.pump === true && deviceShadow?.state?.reported?.pump === false ? 
                        (<img className='flip-image' src={time} alt='Time Icon'></img>)
                        :
                        (<img className='flip-image' src={time} alt='Time Icon'></img>)
                    )
                }
            </div>
            <h4>Pump Water</h4>
        </div>
    );
}