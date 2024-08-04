import React, {useState} from 'react';
import Modal from '../Components/Modal';
import PropTypes from 'prop-types';
import { useAuth } from "../Provider/authProvider";
import axios from "axios";

export default function ConfirmActionModal({children, mainIcon, setAutoSwitch, setConfirmAuto, autoSwitch, device}) {
    
    const [error, setError] = useState('Error');
    const [errorCSS, setErrorCSS] = useState('error-message hidden');
    const { token } = useAuth();

    const client = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        
        headers: {
            "Authorization": "Bearer " + token
        }
        
    });

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
            if (device.pump_water && autoSwitch){
                setError("Cannot switch to auto while waiting to pump water");
                setErrorCSS('error-message');
                return;
            }

            await client.post("/dashboard/updateAuto", { device_id: device.device_id, automate: autoSwitch});
            setErrorCSS('error-message hidden');
            setConfirmAuto(false);
            
        } catch (error) {
            setError(error.response.data.msg);
            setErrorCSS('error-message');
        } 

        
        
    }

    return (
        <Modal 
            addClose={true} 
            addButton={true}
            buttonLabel='Accept'
            isButtonPrimary={true}
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