import React, { useState, useEffect, useCallback } from 'react';
import triangle from '../../Images/triangle-orange.svg';
import PerformanceView from './PerformanceView';
import Account from './Account';
import AddDeviceModal from '../../Modals/AddDeviceModal';
import ConfirmActionModal from '../../Modals/ConfirmActionModal';
import DashboardHeader from './DashboardHeader';
import DeviceMenu from './DeviceMenu';
import AddDevice from './AddDevice';
import { useAuth } from "../../Provider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../../Provider/SocketProvider';
import { useDeviceData } from '../../Hooks/useDeviceData';
import LoadingDots from '../../Components/LoadingDots';

export default function Dashboard() {
    const [state, setState] = useState({
        connectDeviceToggle: false,
        autoSwitch: false,
        confirmAuto: false,
        currentDashboardView: 'performanceView',
        isSettingsVisible: false,
    });

    const navigate = useNavigate();
    
    const { 
        clearAccessToken,
        accessToken, 
        user, 
        clearUser 
    } = useAuth();

    const { 
        sendRemoveUser, 
        isConnected, 
        sendCheckSocket, 
        refresh, 
        setRefresh, 
        errorReconnect, 
        setErrorReconnect 
    } = useSocket();

    const handleLogout = useCallback(() => {
        if (user) {
            try {
                sendRemoveUser(user.user_id);
            } catch (error) {
                console.error(error);
            }
        }
        clearUser();
        clearAccessToken();
        navigate("/auth", { replace: true });
    }, [user, sendRemoveUser, clearUser, clearAccessToken, navigate]);

    const { fetchUserDevices, isDevicesLoading, isDevicesLoaded } = useDeviceData(handleLogout);

    const setView = useCallback((view, settingsVisible) => {
        setState(prevState => ({
            ...prevState,
            currentDashboardView: view,
            isSettingsVisible: settingsVisible,
        }));
    }, []);

    const handlePlantPalClick = useCallback(() => {
        navigate('/', { replace: true });
    }, [navigate]);

    const renderView = useCallback(() => {
        switch (state.currentDashboardView) {
            case 'performanceView':
                return <PerformanceView
                    handleRefreshClick={fetchUserDevices}
                    setConnectDeviceToggle={connectDeviceToggle => setState(prev => ({ ...prev, connectDeviceToggle }))}
                    connectDeviceToggle={state.connectDeviceToggle}
                    autoSwitch={state.autoSwitch}
                    setAutoSwitch={autoSwitch => setState(prev => ({ ...prev, autoSwitch }))}
                    setConfirmAuto={confirmAuto => setState(prev => ({ ...prev, confirmAuto }))}
                    isDevicesLoading={isDevicesLoading}
                />;
            case 'accountView':
                return <Account />;
            case 'addDeviceView':
                return <AddDevice
                    setConnectDeviceToggle={connectDeviceToggle => setState(prev => ({ ...prev, connectDeviceToggle }))}
                    showPerformanceView={() => setView('performanceView', false)}
                />;
            default:
                return <PerformanceView
                    handleRefreshClick={fetchUserDevices}
                    setConnectDeviceToggle={connectDeviceToggle => setState(prev => ({ ...prev, connectDeviceToggle }))}
                    connectDeviceToggle={state.connectDeviceToggle}
                    autoSwitch={state.autoSwitch}
                    setAutoSwitch={autoSwitch => setState(prev => ({ ...prev, autoSwitch }))}
                    setConfirmAuto={confirmAuto => setState(prev => ({ ...prev, confirmAuto }))}
                    isDevicesLoading={isDevicesLoading}
                />;
        }
    }, [state, fetchUserDevices, setView]);

    useEffect(() => {
        if (!accessToken || !user) {
            navigate("/auth", { replace: true });
        } else {
            sendCheckSocket(user.user_id);
            fetchUserDevices();
        }
    }, [accessToken, user]);

    useEffect(() => {
        if (errorReconnect) {
            setErrorReconnect(false);
            handleLogout();
        }
    }, [errorReconnect, setErrorReconnect]);

    useEffect(() => {
        if (isConnected && refresh) {
            fetchUserDevices();
            setRefresh(false);
        }
    }, [isConnected, refresh]);

    return (
        <section className="dashboard">

            {state.connectDeviceToggle && <AddDeviceModal setConnectDeviceToggle={() => setState(prev => ({ ...prev, connectDeviceToggle: false }))} />}

            {state.confirmAuto && <ConfirmActionModal
                autoSwitch={state.autoSwitch}
                setConfirmAuto={() => setState(prev => ({ ...prev, confirmAuto: false }))}
                setAutoSwitch={autoSwitch => setState(prev => ({ ...prev, autoSwitch }))}
                mainIcon={triangle}
                children={state.autoSwitch ? "Confirm setting PlantPal to automatic watering." : "Confirm setting PlantPal to manual watering"}
            />}

            <div className={isDevicesLoading? 'dashboard-grid-loading' : state.isSettingsVisible ? 'dashboard-grid-settings' : 'dashboard-grid'}>
            
                <DashboardHeader
                    handlePlantPalClick={handlePlantPalClick}
                    handleRefreshClick={fetchUserDevices}
                    handleLogout={handleLogout}
                    showAccountView={() => setView('accountView', true)}
                    isSettingsVisible={state.isSettingsVisible}
                    isDevicesLoading={isDevicesLoading}
                    isDevicesLoaded={isDevicesLoaded}
                />

                {isDevicesLoading? (<LoadingDots></LoadingDots>) :
                (
                    <>
                        <DeviceMenu
                            connectDeviceToggle={state.connectDeviceToggle}
                            showAddDeviceView={() => setView('addDeviceView', true)}
                            isSettingsVisible={state.isSettingsVisible}
                            showPerformanceView={() => setView('performanceView', false)}
                        />

                        {renderView()}
                    </>
                )}
            </div>
        </section>
    );
}
