import Button from '../../Components/Button/Button';
import InputField from '../../Components/InputField/InputField';
import wifi_logo from '../../Images/wifi-brown.svg';
import lock from '../../Images/lock-brown.svg';
import "./EditWifiForm.css";
import React from 'react';

interface EditWifiFormProps {
    handleUpdateWifiSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
}

export default function EditWifiForm({ 
    handleUpdateWifiSubmit, 
    handleInputChange,
    error,
}: EditWifiFormProps) {

    return (
        <form id='update-wifi' className='update-wifi' onSubmit={handleUpdateWifiSubmit}>
            <h3>Connection</h3>
            <InputField 
                onChange={handleInputChange} 
                inputImg={wifi_logo} 
                isRequired={true} 
                type='text' 
                placeholder='Wifi SSID' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

            <InputField 
                onChange={handleInputChange} 
                inputImg={lock} 
                isRequired={true} 
                type='password' 
                placeholder='Wifi Password' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

            <Button className='padded' styleType='tertiary' type='submit'>Connect Wifi?</Button>

            {error && <div className="error-message">{error}</div>}
        </form>
    );
}