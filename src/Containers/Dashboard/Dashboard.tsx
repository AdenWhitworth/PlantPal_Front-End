import React, { useReducer, useEffect, useCallback } from 'react';
import triangle from '../../Images/triangle-orange.svg';
import PerformanceView from './PerformanceView/PerformanceView';
import Account from './Account/Account';
import AddDeviceModal from '../../Modals/AddDeviceModal/AddDeviceModal';
import ConfirmActionModal from '../../Modals/ConfirmActionModal/ConfirmActionModal';
import DashboardHeader from './DashboardHeader/DashboardHeader';
import DeviceMenu from './DeviceMenu/DeviceMenu';
import AddDevice from './AddDevice/AddDevice';
import { useAuth } from "../../Provider/AuthProvider/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useSocket } from '../../Provider/SocketProvider/SocketProvider';
import { useDeviceData } from '../../Hooks/useDeviceData/useDeviceData';
import LoadingDots from '../../Components/LoadingDots/LoadingDots';
import './Dashboard.css';
import { State, StateAction } from './DashboardTypes';
import { useDevice } from '../../Provider/DeviceProvider/DeviceProvider';

const initialState: State = {
  connectDeviceToggle: false,
  confirmAuto: false,
  currentDashboardView: 'performanceView',
  isSettingsVisible: false,
};

/**
 * Reducer function to manage the dashboard state.
 * 
 * @function
 * @param {State} state - The current state of the dashboard.
 * @param {StateAction} action - The action to be processed.
 * @returns {State} - The new state after the action is applied.
 */
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
    case 'SET_CONFIRM_AUTO':
      return { ...state, confirmAuto: action.payload };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

/**
 * Dashboard component responsible for rendering various views and handling the application state.
 * It includes managing device connection, auto-switch functionality, and user session management.
 * 
 * @component
 * @returns {JSX.Element} The rendered Dashboard component.
 */
export default function Dashboard(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState);

  const navigate = useNavigate();
  const { clearAccessToken, accessToken, user, clearUser } = useAuth();
  const { sendRemoveUser, isConnected, sendCheckSocket, refresh, setRefresh, refreshShadow, setRefreshShadow, errorReconnect, setErrorReconnect } = useSocket();
  const { deviceShadow } = useDevice();

  /**
   * Handles the user logout process, including removing the user from the socket, clearing user data, and redirecting to the login page.
   * 
   * @function
   */
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

  const { fetchUserDevices, fetchUserDevice, isDevicesLoading, isDevicesLoaded } = useDeviceData({handleLogout});

  /**
   * Handles the "PlantPal" button click, navigating the user to the homepage.
   * 
   * @function
   */
  const handlePlantPalClick = useCallback(() => navigate('/', { replace: true }), [navigate]);

  /**
   * Sets the current dashboard view and toggles the settings visibility.
   * 
   * @function
   * @param {string} view - The view to set (e.g., 'performanceView', 'accountView').
   * @param {boolean} settingsVisible - Whether the settings should be visible.
   */
  const setView = useCallback((view: string, settingsVisible: boolean) => {
    dispatch({ type: 'SET_VIEW', payload: { view, settingsVisible } });
  }, []);

  /**
   * Renders the current view based on the state.
   * 
   * @function
   * @returns {JSX.Element} The component corresponding to the current view.
   */
  const renderView = useCallback(() => {
    switch (state.currentDashboardView) {
      case 'performanceView':
        return (
          <PerformanceView
            handleRefreshClick={fetchUserDevices}
            setConnectDeviceToggle={(toggle) => dispatch({ type: 'SET_CONNECT_DEVICE_TOGGLE', payload: toggle })}
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
            setConfirmAuto={(confirmAuto) => dispatch({ type: 'SET_CONFIRM_AUTO', payload: confirmAuto })}
          />
        );
    }
  }, [state, fetchUserDevices, setView]);

  /**
   * useEffect hook that handles the user authentication state and checks the socket connection.
   * - If the access token or user is not available, the user is logged out.
   * - If the user exists, it checks the socket connection and fetches user devices.
   */
  useEffect(() => {
    if (!accessToken || !user) {
      handleLogout();
    } else {
      sendCheckSocket(user.user_id);
      fetchUserDevices();
    }
  }, [accessToken, user, sendCheckSocket, fetchUserDevices, handleLogout]);

  /**
   * useEffect hook that monitors socket reconnection errors.
   * - If a reconnection error occurs, the user is logged out.
   */
  useEffect(() => {
    if (errorReconnect) {
      setErrorReconnect(false);
      handleLogout();
    }
  }, [errorReconnect, setErrorReconnect, handleLogout]);

  /**
   * useEffect hook that refreshes user devices when the socket connection is restored.
   * - If the socket is connected and the refresh flag is set, it fetches the user's devices.
   */
  useEffect(() => {
    if (isConnected && refresh) {
      fetchUserDevices();
      setRefresh(false);
    }
  }, [isConnected, refresh, fetchUserDevices, setRefresh]);

  /**
   * useEffect hook that refreshes user device when the socket connection is restored.
   * - If the socket is connected and the refresh flag is set, it fetches the user's device.
   */
  useEffect(() => {
    if (isConnected && refreshShadow) {
      fetchUserDevice();
      setRefreshShadow(false);
    }
  }, [isConnected, refreshShadow, fetchUserDevices, setRefreshShadow]);

  return (
    <section className="dashboard">
      {state.connectDeviceToggle && <AddDeviceModal setConnectDeviceToggle={() => dispatch({ type: 'SET_CONNECT_DEVICE_TOGGLE', payload: false })} />}
      {state.confirmAuto && (
        <ConfirmActionModal
          setConfirmAuto={(confirmAuto: boolean) => dispatch({ type: 'SET_CONFIRM_AUTO', payload: confirmAuto })}
          mainIcon={triangle}
          children={deviceShadow?.state?.reported?.auto? "Confirm setting PlantPal to manual watering" : "Confirm setting PlantPal to automatic watering."}
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

