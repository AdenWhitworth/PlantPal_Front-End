import React, {useState, useEffect} from 'react';
import triangle from '../Images/triangle-orange.svg';
import PerformanceView from '../Containers/PerformanceView';
import Settings from '../Containers/Settings';
import AddDeviceModal from '../Modals/AddDeviceModal';
import ConfirmActionModal from '../Modals/ConfirmActionModal';
import { useAuth } from "../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../Provider/SocketProvider';
import { useDeviceData } from '../Hooks/useDeviceData';

export default function Dashboard() {

    const [settingsToggle, setSettingsToggle] = useState(false);
    const [addDeviceToggel, setAddDeviceToggle] = useState(false);
    const [connectDeviceToggle, setConnectDeviceToggle] = useState(false);
    const [autoSwitch, setAutoSwitch] = useState(false);
    const [confirmAuto, setConfirmAuto] = useState(false);

    const navigate = useNavigate();
    const { clearToken, token, user, setUser, clearUser } = useAuth();
    const { sendRemoveUser, isConnected, sendCheckSocket, refresh, setRefresh, errorReconnect, setErrorReconnect } = useSocket();

    const handlePlantPalClick = () => {
        navigate('/', {
            replace: true,
        });
    }

    const handleRefreshClick = () => {
        fetchUserDevices();
    }

    const handleLogout = () => {
        try {
          if (user) sendRemoveUser(user.user_id);
        } catch (error) {
          console.log(error);
        }
        clearUser();
        clearToken();
        navigate("/auth", { replace: true });
    };

    const { fetchUserDevices } = useDeviceData(handleLogout);

    useEffect(() => {
        if (!token || !user) {
          navigate("/auth", { replace: true });
        } else {
          sendCheckSocket(user.user_id);
          fetchUserDevices();
        }
    }, [token, user]);

    useEffect(() => {
        if(errorReconnect){
            setErrorReconnect(false);
            handleLogout();
        }
    }, [errorReconnect])

    useEffect(() => {
        if (isConnected && refresh) {
          fetchUserDevices();
          setRefresh(false);
        }
    }, [isConnected, refresh]);

    return (
        <section className="dashboard">
            
            {connectDeviceToggle? <AddDeviceModal setConnectDeviceToggle={setConnectDeviceToggle}></AddDeviceModal> : <></>}

            {confirmAuto?  <ConfirmActionModal autoSwitch={autoSwitch} setConfirmAuto={setConfirmAuto} setAutoSwitch={setAutoSwitch} mainIcon={triangle} children={autoSwitch? "Confirm setting PlantPal to automatic watering." : "Confirm setting PlantPal to manual watering"}></ConfirmActionModal>: <></> }

            {settingsToggle? <Settings setSettingsToggle={setSettingsToggle} addDeviceToggel={addDeviceToggel} setAddDeviceToggle={setAddDeviceToggle} setConnectDeviceToggle={setConnectDeviceToggle} handlePlantPalClick={handlePlantPalClick} handleRefreshClick={handleRefreshClick} handleLogout={handleLogout} settingsToggle={settingsToggle} connectDeviceToggle={connectDeviceToggle}></Settings> : <PerformanceView setSettingsToggle={setSettingsToggle} setAddDeviceToggle={setAddDeviceToggle} handlePlantPalClick={handlePlantPalClick} handleRefreshClick={handleRefreshClick} handleLogout={handleLogout} settingsToggle={settingsToggle} setConnectDeviceToggle={setConnectDeviceToggle} connectDeviceToggle={connectDeviceToggle} autoSwitch={autoSwitch} setAutoSwitch={setAutoSwitch} setConfirmAuto={setConfirmAuto}></PerformanceView>}

        </section>
    );
}