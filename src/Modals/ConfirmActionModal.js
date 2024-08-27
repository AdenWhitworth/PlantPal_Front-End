import React, {useState} from 'react';
import Modal from '../Components/Modal';
import PropTypes from 'prop-types';
import { useAuth } from "../Provider/AuthProvider";
import { postUpdateAuto } from '../Services/ApiService';
import { useDevice } from '../Provider/DeviceProvider';

export default function ConfirmActionModal({children, mainIcon, setAutoSwitch, setConfirmAuto, autoSwitch}) {
    
    const [error, setError] = useState('Error');
    const [errorCSS, setErrorCSS] = useState('error-message hidden');
    const { accessToken } = useAuth();
    const { device, deviceShadow } = useDevice();

    const handleCloseClick = () => {
        if (autoSwitch){
            setAutoSwitch(false);
            setConfirmAuto(false);
        } else {
            setAutoSwitch(true);
            setConfirmAuto(false);
        }
        
    }

    const handleButtonClick = async () => {
        
        try {
            if (deviceShadow.state.reported.pump || deviceShadow.state.desired.pump && autoSwitch){
                setError("Cannot switch to auto while waiting to pump water");
                setErrorCSS('error-message');
                return;
            }

            await postUpdateAuto(accessToken,{ 
                device_id: device.device_id, 
                automate: autoSwitch
            });

            setErrorCSS('error-message hidden');
            setConfirmAuto(false);
            
        } catch (error) {
            setError(error.response.data.message);
            setErrorCSS('error-message');
        } 
    }

    return (
        <Modal 
            addClose={true} 
            addButton={true}
            buttonLabel='Accept'
            styleType='primary'
            children={
                <div>
                    <img src={mainIcon} alt='Confirm Action Icon'></img>
                    <h3>{children}</h3>
                    <h4 className={errorCSS}>{error}</h4>
                </div>
            }
            handleCloseClick={handleCloseClick}
            handleButtonClick={handleButtonClick}
        ></Modal>
    );
}

Modal.propTypes = {
    children: PropTypes.isRequired,
};