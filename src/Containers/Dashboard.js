import React, {useState} from 'react';
import PerformanceView from '../Containers/PerformanceView';
import Settings from '../Containers/Settings';
import AddDeviceModal from '../Modals/AddDeviceModal';

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