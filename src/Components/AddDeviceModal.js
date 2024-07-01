import React from 'react';
import x_circle from '../Images/x-circle-black.svg';
import time from '../Images/time-green.svg';
import Button from '../Components/Button';

export default function AddDeviceModal({setConnectDeviceToggle}) {

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

                <h4>Connecting to W2R4TY...</h4>

                <div className='modal-time'>
                    <img className='flip-image' src={time} alt='Time Icon'></img>
                </div>
                
                <p>Press the network button on the device to connect. Led on device will turn green when successful.</p>

                <div className='modal-btns'>
                    <Button children='Continue' isPrimaryStyle={true} onClick={handleContinueClick}></Button>
                </div>
            </div>
        </div>
    );
}