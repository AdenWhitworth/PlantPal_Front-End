import React, {useState} from 'react';
import PerformanceView from '../Components/PerformanceView';
import Settings from '../Components/Settings';

export default function Dashboard({}) {

    const [settingsToggle, setSettingsToggle] = useState(false);
    const [addDeviceToggel, setAddDeviceToggle] = useState(false);

    return (
        <section className="dashboard">

            {settingsToggle? <Settings setSettingsToggle={setSettingsToggle} addDeviceToggel={addDeviceToggel} setAddDeviceToggle={setAddDeviceToggle}></Settings> : <PerformanceView setSettingsToggle={setSettingsToggle} setAddDeviceToggle={setAddDeviceToggle}></PerformanceView>}
        </section>
    );
}