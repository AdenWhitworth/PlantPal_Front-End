import React, { useReducer, useEffect, useCallback } from 'react';
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

interface State {
    connectDeviceToggle: boolean;
    autoSwitch: boolean;
    confirmAuto: boolean;
    currentDashboardView: string;
    isSettingsVisible: boolean;
}

// Define state actions
type StateAction =
  | { type: 'SET_VIEW'; payload: { view: string; settingsVisible: boolean } }
  | { type: 'SET_CONNECT_DEVICE_TOGGLE'; payload: boolean }
  | { type: 'SET_AUTO_SWITCH'; payload: boolean }
  | { type: 'SET_CONFIRM_AUTO'; payload: boolean }
  | { type: 'RESET_STATE' };

// Define initial state
const initialState: State = {
  connectDeviceToggle: false,
  autoSwitch: false,
  confirmAuto: false,
  currentDashboardView: 'performanceView',
  isSettingsVisible: false,
};

// Reducer function to manage state changes
function reducer(state: State, action: StateAction): State {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        currentDashboardView: action.payload.view,
        isSettingsVisible: action.payload.settingsVisible,
      };
    case 'SET_CONNECT_DEVICE_TOGGLE':
      return { ...state, connectDeviceToggle: action.payload };
    case 'SET_AUTO_SWITCH':
      return { ...state, autoSwitch: action.payload };
    case 'SET_CONFIRM_AUTO':
      return { ...state, confirmAuto: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

export default function Dashboard() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const { clearAccessToken, accessToken, user, clearUser } = useAuth();
  const { sendRemoveUser, isConnected, sendCheckSocket, refresh, setRefresh, errorReconnect, setErrorReconnect } = useSocket();
  
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

  const { fetchUserDevices, isDevicesLoading, isDevicesLoaded } = useDeviceData({handleLogout});

  const handlePlantPalClick = useCallback(() => navigate('/', { replace: true }), [navigate]);

  const setView = useCallback((view: string, settingsVisible: boolean) => {
    dispatch({ type: 'SET_VIEW', payload: { view, settingsVisible } });
  }, []);

  const renderView = useCallback(() => {
    switch (state.currentDashboardView) {
      case 'performanceView':
        return (
          <PerformanceView
            handleRefreshClick={fetchUserDevices}
            setConnectDeviceToggle={(toggle) => dispatch({ type: 'SET_CONNECT_DEVICE_TOGGLE', payload: toggle })}
            autoSwitch={state.autoSwitch}
            setAutoSwitch={(autoSwitch) => dispatch({ type: 'SET_AUTO_SWITCH', payload: autoSwitch })}
            setConfirmAuto={(confirmAuto) => dispatch({ type: 'SET_CONFIRM_AUTO', payload: confirmAuto })}
          />
        );
      case 'accountView':
        return <Account />;
      case 'addDeviceView':
        return (
          <AddDevice
            setConnectDeviceToggle={(toggle) => dispatch({ type: 'SET_CONNECT_DEVICE_TOGGLE', payload: toggle })}
            showPerformanceView={() => setView('performanceView', false)}
          />
        );
      default:
        return (
          <PerformanceView
            handleRefreshClick={fetchUserDevices}
            setConnectDeviceToggle={(toggle) => dispatch({ type: 'SET_CONNECT_DEVICE_TOGGLE', payload: toggle })}
            autoSwitch={state.autoSwitch}
            setAutoSwitch={(autoSwitch) => dispatch({ type: 'SET_AUTO_SWITCH', payload: autoSwitch })}
            setConfirmAuto={(confirmAuto) => dispatch({ type: 'SET_CONFIRM_AUTO', payload: confirmAuto })}
          />
        );
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
      {state.connectDeviceToggle && <AddDeviceModal setConnectDeviceToggle={() => dispatch({ type: 'SET_CONNECT_DEVICE_TOGGLE', payload: false })} />}
      {state.confirmAuto && (
        <ConfirmActionModal
          autoSwitch={state.autoSwitch}
          setConfirmAuto={(confirmAuto: boolean) => dispatch({ type: 'SET_CONFIRM_AUTO', payload: confirmAuto })}
          setAutoSwitch={(autoSwitch: boolean) => dispatch({ type: 'SET_AUTO_SWITCH', payload: autoSwitch })}
          mainIcon={triangle}
          children={state.autoSwitch ? "Confirm setting PlantPal to automatic watering." : "Confirm setting PlantPal to manual watering"}
        />
      )}
      <div className={isDevicesLoading ? 'dashboard-grid-loading' : state.isSettingsVisible ? 'dashboard-grid-settings' : 'dashboard-grid'}>
        <DashboardHeader
          handlePlantPalClick={handlePlantPalClick}
          handleRefreshClick={fetchUserDevices}
          handleLogout={handleLogout}
          showAccountView={() => setView('accountView', true)}
          isSettingsVisible={state.isSettingsVisible}
          isDevicesLoading={isDevicesLoading}
          isDevicesLoaded={isDevicesLoaded}
        />
        {isDevicesLoading ? <LoadingDots /> : (
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

