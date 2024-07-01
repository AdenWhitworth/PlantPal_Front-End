import React, {useState} from 'react';
import PerformanceView from '../Components/PerformanceView';
import Settings from '../Components/Settings';
import AddDeviceModal from '../Components/AddDeviceModal';

export default function Dashboard({setUser}) {

    const [settingsToggle, setSettingsToggle] = useState(false);
    const [addDeviceToggel, setAddDeviceToggle] = useState(false);
    const [connectDeviceToggle, setConnectDeviceToggle] = useState(false);

    return (
        <section className="dashboard">
            
            {connectDeviceToggle? <AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggle}></AddDeviceModal> : <></>}

            {settingsToggle? <Settings setSettingsToggle={setSettingsToggle} addDeviceToggel={addDeviceToggel} setAddDeviceToggle={setAddDeviceToggle} setConnectDeviceToggle={setConnectDeviceToggle} setUser={setUser}></Settings> : <PerformanceView setSettingsToggle={setSettingsToggle} setAddDeviceToggle={setAddDeviceToggle} setUser={setUser}></PerformanceView>}

        </section>
    );
}