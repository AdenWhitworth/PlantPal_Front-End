import React, {useState, useEffect} from 'react';
import triangle from '../Images/triangle-orange.svg';
import PerformanceView from '../Containers/PerformanceView';
import Settings from '../Containers/Settings';
import AddDeviceModal from '../Modals/AddDeviceModal';
import ConfirmActionModal from '../Modals/ConfirmActionModal';
import { useAuth } from "../Provider/authProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard({user, setUser}) {

    const [settingsToggle, setSettingsToggle] = useState(false);
    const [addDeviceToggel, setAddDeviceToggle] = useState(false);
    const [connectDeviceToggle, setConnectDeviceToggle] = useState(false);

    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState({});
    const [deviceLogs, setDeviceLogs] = useState([]);
    const [lastLog, setLastLog] = useState({});
    const [refreshDate, setRefreshDate] = useState("");
    const [autoSwitch, setAutoSwitch] = useState(false);
    const [confirmAuto, setConfirmAuto] = useState(false);

    const navigate = useNavigate();
    const { clearToken, token } = useAuth();

    const client = axios.create({
        baseURL: process.env.REACT_APP_BASE_URL,
        
        headers: {
            "Authorization": "Bearer " + token
        }
        
    });

    const handlePlantPalClick = () => {
        navigate('/', {
            replace: true,
        });
    }

    const fetchUserDevices = async () => {
        try {
            const response = await client.get("/dashboard/userDevices");

            setDevices(response.data.devices);
            
        } catch (error) {
            clearToken();
            navigate("/auth", { replace: true });
        }
    }

    const handleRefreshClick = () => {
        fetchUserDevices();
    }

    const fethDeviceLogs = async () => {
        try {
            const response = await client.get("/dashboard/deviceLogs", { params: {cat_num: device.cat_num}});

            setDeviceLogs(response.data.deviceLogs);
            setLastLog(response.data.lastLog);
            
        } catch (error) {
            clearToken();
            navigate("/auth", { replace: true });
        }
    }

    const formatRefreshDate = () => {
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const dateObject = new Date(lastLog.log_date);

        const localTimeString = dateObject.toLocaleString(undefined, {
            timeZone: userTimeZone,
        });
          
        setRefreshDate(localTimeString);
    }

    const handleLogout = () => {
        clearToken();
        navigate("/auth", { replace: true });
    };

    useEffect(() => {
        fetchUserDevices();
    }, [device]);
    
    useEffect(() => {
        if(typeof device !== "undefined"){
            fethDeviceLogs();
        }
    }, [device]);

    useEffect(() => {
        if(typeof lastLog !== "undefined"){
            formatRefreshDate();
        } else {
            setRefreshDate("");
        }
    }, [lastLog]);

    return (
        <section className="dashboard">
            
            {connectDeviceToggle? <AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggle}></AddDeviceModal> : <></>}

            {confirmAuto?  <ConfirmActionModal device={device} autoSwitch={autoSwitch} setConfirmAuto={setConfirmAuto} setAutoSwitch={setAutoSwitch} mainIcon={triangle} children={autoSwitch? "Confirm setting PlantPal to automatic watering." : "Confirm setting PlantPal to manual watering"}></ConfirmActionModal>: <></> }

            {settingsToggle? <Settings setSettingsToggle={setSettingsToggle} addDeviceToggel={addDeviceToggel} setAddDeviceToggle={setAddDeviceToggle} setConnectDeviceToggle={setConnectDeviceToggle} handlePlantPalClick={handlePlantPalClick} handleRefreshClick={handleRefreshClick} devices={devices} lastLog={lastLog} device={device} setDevice={setDevice} refreshDate={refreshDate} handleLogout={handleLogout} settingsToggle={settingsToggle} connectDeviceToggle={connectDeviceToggle} setUser={setUser} user={user}></Settings> : <PerformanceView setSettingsToggle={setSettingsToggle} setAddDeviceToggle={setAddDeviceToggle} handlePlantPalClick={handlePlantPalClick} handleRefreshClick={handleRefreshClick} devices={devices} lastLog={lastLog} device={device} setDevice={setDevice} refreshDate={refreshDate} handleLogout={handleLogout} settingsToggle={settingsToggle} setConnectDeviceToggle={setConnectDeviceToggle} deviceLogs={deviceLogs} connectDeviceToggle={connectDeviceToggle} autoSwitch={autoSwitch} setAutoSwitch={setAutoSwitch} setConfirmAuto={setConfirmAuto}></PerformanceView>}

        </section>
    );
}