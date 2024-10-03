import Button from '../../../../../Components/Button/Button';
import InputField from '../../../../../Components/InputField/InputField';
import wifi_logo from '../../../../../Images/wifi-brown.svg';
import lock from '../../../../../Images/lock-brown.svg';
import x_circle from '../../../../../Images/x-circle-black.svg';
import "./EditWifiForm.css";
import React from 'react';
import { EditWifiFormProps } from './EditWifiFormTypes';

/**
 * A form component for updating Wi-Fi settings.
 * 
 * @component
 * @param {EditWifiFormProps} props - The props for the EditWifiForm component.
 * @returns {JSX.Element} The rendered form component.
 */
export default function EditWifiForm({ 
    handleUpdateWifiSubmit, 
    handleInputChange,
    error,
    connectionLoading,
    handleCloseClick
}: EditWifiFormProps): JSX.Element {

    return (
        <form id='update-wifi' className='update-wifi' onSubmit={handleUpdateWifiSubmit} data-testid="wifi-form">
            <div className='modal-close'>
                <img className='grow' src={x_circle} alt='Close Icon' onClick={handleCloseClick}></img>
            </div>

            <h3>Connection</h3>
            <InputField 
                onChange={handleInputChange} 
                name='wifiSSID'
                inputImg={wifi_logo} 
                isRequired={true} 
                type='text' 
                placeholder='Wifi SSID' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

            <InputField 
                onChange={handleInputChange} 
                name='wifiPassword'
                inputImg={lock} 
                isRequired={true} 
                type='password' 
                placeholder='Wifi Password' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

            <Button className='padded' styleType='tertiary' disabled={connectionLoading} type='submit'>{connectionLoading? "Connecting...": "Connect Device?"}</Button>
            
            {error && <div className="error-message">{error}</div>}
        </form>
    );
}