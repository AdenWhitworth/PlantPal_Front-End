import React, {useState, useEffect, useCallback} from 'react';
import x_circle from "../../../../Images/x-circle-red.svg";
import check_circle from "../../../../Images/check-circle-green.svg";
import triangle from "../../../../Images/triangle-orange.svg";
import { useDevice } from '../../../../Provider/DeviceProvider';
import './WaterStatus.css';

interface WaterStatusState {
    text: string;
    cssClass: string;
    imgSrc: string;
    imgAlt: string;
}

export default function WaterStatus() {

    const [waterStatus, setWaterStatus] = useState<WaterStatusState>({
        text: "",
        cssClass: "good-water",
        imgSrc: triangle,
        imgAlt: "Status icon triangle"
    });
    const [isStatusVisible, setIsStatusVisible] = useState(false);
    const { devices, lastLog } = useDevice();
    const cap_target = 600;

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

    useEffect(() => {
        formatWaterStatus();
    }, [lastLog, formatWaterStatus]);

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