import React, {useState, useEffect, useCallback} from 'react';
import x_circle from "../../../../Images/x-circle-red.svg";
import check_circle from "../../../../Images/check-circle-green.svg";
import triangle from "../../../../Images/triangle-orange.svg";
import { useDevice } from '../../../../Provider/DeviceProvider/DeviceProvider';
import './WaterStatus.css';
import { WaterStatusState } from './WaterStatusTypes';

/**
 * WaterStatus component displays the current water status of the plant.
 *
 * This component checks the soil moisture level and displays a corresponding status message,
 * including an icon and text indicating whether the plant has sufficient water or needs watering.
 *
 * @component
 * @returns {JSX.Element} The rendered WaterStatus component.
 */
export default function WaterStatus(): JSX.Element {

    const [waterStatus, setWaterStatus] = useState<WaterStatusState>({
        text: "",
        cssClass: "good-water",
        imgSrc: triangle,
        imgAlt: "Status icon triangle"
    });
    const [isStatusVisible, setIsStatusVisible] = useState<boolean>(false);
    const { devices, lastLog } = useDevice();
    const cap_target = 600; // Target capacitance value where anything below requires watering.

    /**
     * Formats the water status based on the last log's soil capacity.
     *
     * This function updates the waterStatus state based on the current soil capacity reading.
     * If there is no last log, it sets a default status. If the soil capacity is greater than
     * the target, it indicates sufficient water; otherwise, it indicates the need for watering.
     *
     * @function
     */
    const formatWaterStatus = useCallback(() => {
        if (!lastLog) {
            setWaterStatus({
                text: "",
                cssClass: "good-water",
                imgSrc: triangle,
                imgAlt: "Status icon triangle"
            });
        } else if (lastLog.soil_cap > cap_target) {
            setWaterStatus({
                text: "Sufficient Water",
                cssClass: "good-water",
                imgSrc: check_circle,
                imgAlt: "Status icon check"
            });
        } else {
            setWaterStatus({
                text: "Needs Water",
                cssClass: "bad-water",
                imgSrc: x_circle,
                imgAlt: "Status icon cross"
            });
        }
    }, [lastLog, cap_target]); 

    /**
     * Updates the water status whenever the last log changes.
     *
     * This effect runs the formatWaterStatus function to ensure the water status is updated
     * based on the most recent soil capacity reading from the last log.
     */
    useEffect(() => {
        formatWaterStatus();
    }, [lastLog, formatWaterStatus]);

    /**
     * Sets the visibility of the water status based on the presence of devices.
     *
     * This effect checks if there are any connected devices and updates the isStatusVisible state
     * accordingly. If there are devices, the status indicator is displayed; otherwise, it is hidden.
     */
    useEffect(() => {
        setIsStatusVisible(devices.length > 0);
    }, [devices]);

    return (
        <div className={`dashboard-status ${isStatusVisible ? '' : 'hidden'}`}>
            <h3>Water Status</h3>

            <div className='status-indicator'>
                <img src={waterStatus.imgSrc} alt={waterStatus.imgAlt}></img>
                <h3 className={waterStatus.cssClass}>{waterStatus.text}</h3>
            </div>
        </div>
    );
}