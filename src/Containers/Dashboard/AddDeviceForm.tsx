import Button from '../../Components/Button/Button';
import InputField from '../../Components/InputField/InputField';
import wifi from '../../Images/wifi-brown.svg';
import lock from '../../Images/lock-brown.svg';
import location from '../../Images/location-brown.svg';
import tag from '../../Images/tag-brown.svg';
import plus_circle from '../../Images/plus-circle-gray.svg';


interface AddDeviceFormProps {
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    error: string | null;
    handleConnectClick: (event: React.FormEvent<HTMLFormElement>) => void;
}

export default function AddDeviceForm({ 
    handleInputChange,
    error,
    handleConnectClick,
}: AddDeviceFormProps) {
    return (
        <form id="new-device" className="new-device-section-2" onSubmit={handleConnectClick}>
                        
            <div className='new-device-logo'>
                <img className="new-device-logo-img" src={plus_circle} alt="New device logo"></img>
                <h1 className="new-device-logo-txt">New Device</h1>
            </div>
            
            <InputField 
                onChange={handleInputChange} 
                name='deviceLocation'
                inputImg={location} isRequired={true} 
                type='text' 
                placeholder='Location' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

            <InputField 
                onChange={handleInputChange} 
                name='assetNumber'
                inputImg={tag} 
                isRequired={true} 
                type='text' 
                placeholder='Asset Number' 
                isSpellCheck={false} 
                setWidth={'60%'}
            ></InputField>

            <InputField 
                onChange={handleInputChange} 
                name='wifiSSID'
                inputImg={wifi} 
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
            
            <div className='new-device-section-2-btns'>
                <div></div>
                
                <Button type='submit' styleType='secondary'>Connect</Button>
            </div>
            {error && <div className="error-message">{error}</div>}
        </form>
    );
}