import React from 'react';
import Modal from '../../Components/Modal/Modal';
import time from '../../Images/time-green.svg';
import check from "../../Images/check-circle-green.svg";
import { useDevice } from '../../Provider/DeviceProvider/DeviceProvider';
import { AddDeviceModalProps } from './AddDeviceModalTypes';

/**
 * Represents a modal for adding a device.
 *
 * @function AddDeviceModal
 * @param {AddDeviceModalProps} props - The props for the AddDeviceModal component.
 * @returns {JSX.Element} The rendered modal component.
 *
 * @example
 * <AddDeviceModal setConnectDeviceToggle={setToggle} />
 */
export default function AddDeviceModal({
    setConnectDeviceToggle
}:AddDeviceModalProps): JSX.Element {

    const { device } = useDevice();
    
    const handleCloseClick = () => {
        setConnectDeviceToggle(false);
    }

    const handleContinueClick = () => {
        setConnectDeviceToggle(false);
    }

    const devicePresent = device !== null;

    return (

        <Modal 
            addClose={devicePresent? !device.presence_connection : true} 
            addButton={devicePresent? device.presence_connection : false}
            buttonLabel='Continue'
            styleType='primary'
            children={
                devicePresent? (
                    <>
                        {device.presence_connection? <h4>Successfully connected to {device.cat_num}!</h4> : <h4>Connecting to {device.cat_num}...</h4>}

                        {device.presence_connection? 
                            
                            <div className='modal-check'>
                                <img className='loaded' src={check} alt='Check Icon'></img>
                            </div>
                        :
                            <div className='modal-time'>
                                <img className='flip-image' src={time} alt='Time Icon'></img>
                            </div>
                        }
                        
                    </>
                ) : (<></>)
            }
            handleCloseClick={handleCloseClick}
            handleButtonClick={handleContinueClick}
        ></Modal>
    );
}