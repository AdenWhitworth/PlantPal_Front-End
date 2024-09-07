import React, {useState, useEffect} from 'react';
import x_circle from "../../Images/x-circle-red.svg";
import check_circle from "../../Images/check-circle-green.svg";
import triangle from "../../Images/triangle-orange.svg";
import { useDevice } from '../../Provider/DeviceProvider';

interface WaterStatus {
    text: string;
    cssClass: string;
    imgSrc: string;
}

export default function WaterStatus() {

    const [waterStatus, setWaterStatus] = useState<WaterStatus>({
        text: "",
        cssClass: "good-water",
        imgSrc: triangle,
    });
    const [isStatusVisible, setIsStatusVisible] = useState(false);
    const { devices, lastLog } = useDevice();
    const cap_target = 600;

    const formatWaterStatus = () => {
        
        if (!lastLog) {
            setWaterStatus({
                text: "",
                cssClass: "good-water",
                imgSrc: triangle,
            });
        } else if (lastLog.soil_cap > cap_target) {
            setWaterStatus({
                text: "Sufficient Water",
                cssClass: "good-water",
                imgSrc: check_circle ,
            });
        } else {
            setWaterStatus({
                text: "Needs Water",
                cssClass: "bad-water",
                imgSrc: x_circle  ,
            });
        }
    }

    useEffect(() => {
        formatWaterStatus();
    }, [lastLog]);

    useEffect(() => {
        setIsStatusVisible(devices.length > 0);
    }, [devices]);

    return (
        <div className={`dashboard-status ${isStatusVisible ? '' : 'hidden'}`}>
            <h3>Water Status</h3>

            <div className='status-indicator'>
                <img src={waterStatus.imgSrc} alt='Status icon'></img>
                <h3 className={waterStatus.cssClass}>{waterStatus.text}</h3>
            </div>
        </div>
    );
}