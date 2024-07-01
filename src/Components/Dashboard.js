import React, {useState} from 'react';
import PerformanceView from '../Components/PerformanceView';
import Settings from '../Components/Settings';

export default function Dashboard({}) {

    const [settingsToggle, setSettingsToggle] = useState(false);

    return (
        <section className="dashboard">

            {settingsToggle? <Settings setSettingsToggle={setSettingsToggle}></Settings> : <PerformanceView setSettingsToggle={setSettingsToggle}></PerformanceView>}
        </section>
    );
}