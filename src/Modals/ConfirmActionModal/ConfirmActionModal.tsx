import React, {useEffect} from 'react';
import Modal from '../../Components/Modal/Modal';
import { useAuth } from "../../Provider/AuthProvider/AuthProvider";
import { useDevice } from '../../Provider/DeviceProvider/DeviceProvider';
import { useSettingsHandlers } from '../../Hooks/useSettingsHandlers/useSettingsHandlers';
import { ConfirmActionModalProps } from './ConfirmActionModalTypes';

/**
 * A modal component that confirms an action related to device automation settings.
 *
 * @function ConfirmActionModal
 * @param {ConfirmActionModalProps} props - The props for the ConfirmActionModal component.
 * @returns {JSX.Element} The rendered ConfirmActionModal component.
 */
export default function ConfirmActionModal({
    children, 
    mainIcon, 
    setConfirmAuto,
}: ConfirmActionModalProps): JSX.Element {

    const { accessToken, setAccessToken } = useAuth();
    const { device, deviceShadow } = useDevice();
    const { handleUpdateAuto, error, resetError} = useSettingsHandlers();

     /**
     * Handles the click event for closing the modal.
     * Sets the state of the auto switch and confirmation based on the current autoSwitch state.
     * @function
     */
    const handleCloseClick = () => {
        setConfirmAuto(false);
    }

    /**
     * Handles the click event for the action button.
     * Triggers the update for device automation settings using the provided access token and device details.
     * Logs an error if the device or its ID is not available.
     * @function
     */
    const handleButtonClick = async () => {

        if (!device || !device.device_id) {
            console.error("Device and device id required");
            return
        }

        const newAutoState = !deviceShadow?.state?.reported?.auto

        handleUpdateAuto(accessToken, setAccessToken, deviceShadow, newAutoState ,{ 
            device_id: device.device_id, 
            automate: newAutoState
        });

        setConfirmAuto(false);
    }

    /**
     * Resets any error state when the component mounts or updates.
     */
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