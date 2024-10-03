/**
 * Represents the state of the application, including various toggles and views.
 * 
 * @interface State
 * @property {boolean} connectDeviceToggle - Indicates whether the device connection toggle is active.
 * @property {boolean} confirmAuto - Indicates whether the confirmation for auto-switch is required.
 * @property {string} currentDashboardView - The currently selected dashboard view.
 * @property {boolean} isSettingsVisible - Indicates whether the settings panel is visible.
 */
export interface State {
    connectDeviceToggle: boolean;
    confirmAuto: boolean;
    currentDashboardView: string;
    isSettingsVisible: boolean;
}

/**
 * Represents the actions that can be dispatched to modify the state.
 * 
 * @type {Object} StateAction
 * @property {'SET_VIEW'} type - Action type to set the current dashboard view.
 * @property {Object} [payload] - The data associated with the action.
 * @property {string} [payload.view] - The new view to be set for the dashboard.
 * @property {boolean} [payload.settingsVisible] - Whether the settings panel should be visible.
 * 
 * @property {'SET_CONNECT_DEVICE_TOGGLE'} type - Action type to toggle the device connection.
 * @property {boolean} [payload] - Boolean indicating the state of the device connection toggle.
 * 
 * @property {'SET_CONFIRM_AUTO'} type - Action type to set the confirmation for auto-switch changes.
 * @property {boolean} [payload] - Boolean indicating whether auto-switch confirmation is required.
 * 
 * @property {'RESET_STATE'} type - Action type to reset the state to its initial values.
 */
export type StateAction =
  | { type: 'SET_VIEW'; payload: { view: string; settingsVisible: boolean } }
  | { type: 'SET_CONNECT_DEVICE_TOGGLE'; payload: boolean }
  | { type: 'SET_CONFIRM_AUTO'; payload: boolean }
  | { type: 'RESET_STATE' };
