import React, {useEffect} from 'react';
import Modal from '../Components/Modal';
import time from '../Images/time-green.svg';
import plus from "../Images/plus-circle-green.svg";
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

        <Modal 
            addClose={true} 
            addButton={device.presence_connection}
            buttonLabel='Continue'
            styleType='primary'
            children={
                <>
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
                </>
            }
            handleCloseClick={handleCloseClick}
            handleButtonClick={handleContinueClick}
        ></Modal>
    );
}