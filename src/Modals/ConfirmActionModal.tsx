import React, {useEffect} from 'react';
import Modal from '../Components/Modal';
import { useAuth } from "../Provider/AuthProvider";
import { useDevice } from '../Provider/DeviceProvider';
import { useSettingsHandlers } from '../Hooks/useSettingsHandlers';

interface ConfirmActionModalProps {
    children: React.ReactNode;
    mainIcon: string;
    setAutoSwitch: (value: boolean) => void;
    setConfirmAuto: (value: boolean) => void;
    autoSwitch: boolean;
}

export default function ConfirmActionModal({
    children, 
    mainIcon, 
    setAutoSwitch, 
    setConfirmAuto, 
    autoSwitch
}: ConfirmActionModalProps) {

    const { accessToken, setAccessToken } = useAuth();
    const { device, deviceShadow } = useDevice();
    const { handleUpdateAuto, error, resetError} = useSettingsHandlers();

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

        if (!device || !device.device_id) {
            console.error("Device and device id required");
            return
        }

        handleUpdateAuto(accessToken, setAccessToken, deviceShadow, autoSwitch ,{ 
            device_id: device.device_id, 
            automate: autoSwitch
        });
    }

    useEffect(() => {
        resetError();
    }, [resetError]);

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
                    {error && <div className="error-message">{error}</div>}
                </div>
            }
            handleCloseClick={handleCloseClick}
            handleButtonClick={handleButtonClick}
        ></Modal>
    );
}