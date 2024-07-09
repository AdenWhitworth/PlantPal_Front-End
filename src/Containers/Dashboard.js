import React, {useState, useEffect} from 'react';
import PerformanceView from '../Containers/PerformanceView';
import Settings from '../Containers/Settings';
import AddDeviceModal from '../Modals/AddDeviceModal';
import { useAuth } from "../Provider/authProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {

    const [settingsToggle, setSettingsToggle] = useState(false);
    const [addDeviceToggel, setAddDeviceToggle] = useState(false);
    const [connectDeviceToggle, setConnectDeviceToggle] = useState(false);

    const [devices, setDevices] = useState([]);
    const [device, setDevice] = useState({});
    const [deviceLogs, setDeviceLogs] = useState([]);
    const [lastLog, setLastLog] = useState({});
    const [refreshDate, setRefreshDate] = useState("");

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

            {settingsToggle? <Settings setSettingsToggle={setSettingsToggle} addDeviceToggel={addDeviceToggel} setAddDeviceToggle={setAddDeviceToggle} setConnectDeviceToggle={setConnectDeviceToggle} handlePlantPalClick={handlePlantPalClick} handleRefreshClick={handleRefreshClick} devices={devices} lastLog={lastLog} device={device} setDevice={setDevice} refreshDate={refreshDate} handleLogout={handleLogout} settingsToggle={settingsToggle}></Settings> : <PerformanceView setSettingsToggle={setSettingsToggle} setAddDeviceToggle={setAddDeviceToggle} handlePlantPalClick={handlePlantPalClick} handleRefreshClick={handleRefreshClick} devices={devices} lastLog={lastLog} device={device} setDevice={setDevice} refreshDate={refreshDate} handleLogout={handleLogout} settingsToggle={settingsToggle} setConnectDeviceToggle={setConnectDeviceToggle}></PerformanceView>}

        </section>
    );
}