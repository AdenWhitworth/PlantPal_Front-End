
/**
 * Props for the DashboardHeader component.
 * 
 * @interface DashboardHeaderProps
 * @property {function} handlePlantPalClick - Function to handle the click on the PlantPal logo.
 * @property {function} handleRefreshClick - Function to handle the click on the refresh button.
 * @property {function} handleLogout - Function to handle user logout.
 * @property {function} showAccountView - Function to display the account view.
 * @property {boolean} isSettingsVisible - Indicates if the settings view is currently visible.
 * @property {boolean} isDevicesLoading - Indicates if devices are currently being loaded.
 * @property {boolean} isDevicesLoaded - Indicates if devices have finished loading.
 */
export interface DashboardHeaderProps {
    handlePlantPalClick: () => void; 
    handleRefreshClick: () => void;
    handleLogout: () => void;
    showAccountView: () => void;
    isSettingsVisible: boolean;
    isDevicesLoading: boolean;
    isDevicesLoaded: boolean;
}