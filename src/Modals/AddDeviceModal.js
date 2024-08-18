import React, {useEffect} from 'react';
import x_circle from '../Images/x-circle-black.svg';
import time from '../Images/time-green.svg';
import plus from "../Images/plus-circle-green.svg";
import Button from '../Components/Button';
import { useDevice } from '../Provider/DeviceProvider';

export default function AddDeviceModal({setConnectDeviceToggle}) {

    const { device } = useDevice();
    
    const handleCloseClick = () => {
        setConnectDeviceToggle(false);
    }

    const handleContinueClick = () => {
        setConnectDeviceToggle(false);
    }

    return (
        <div className="modal">
            <div className='modal-content'>
                <div className='modal-close'>
                    <img className='grow' src={x_circle} alt='Close Icon' onClick={handleCloseClick}></img>
                </div>

                {device.presence_connection? <h4>Successfully to {device.cat_num}</h4> : <h4>Connecting to {device.cat_num}...</h4>}

                {device.presence_connection? 
                    <img src={plus} alt='Plus Icon'></img>
                :
                    <div className='modal-time'>
                        <img className='flip-image' src={time} alt='Time Icon'></img>
                    </div>
                }
                
                {device.presence_connection?
                    <></>
                    :
                    <p>Press the network button on the device to connect. Led on device will turn green when successful.</p>
                }    

                {device.presence_connection? 
                    <div className='modal-btns'>
                        <Button children='Continue' isPrimaryStyle={true} onClick={handleContinueClick}></Button>
                    </div>
                    :
                    <></>
                }
            </div>
        </div>
    );
}