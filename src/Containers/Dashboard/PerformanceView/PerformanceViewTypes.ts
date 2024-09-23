/**
 * Represents the props for the PerformanceView component.
 * 
 * @interface PerformanceViewProps
 * @property {function(boolean): void} setConnectDeviceToggle - Toggles the connection device state.
 * @property {function(): void} handleRefreshClick - Handles the action for refreshing data or the view.
 * @property {boolean} autoSwitch - Indicates whether the auto-switch feature is enabled.
 * @property {function(boolean): void} setAutoSwitch - Sets the state for the auto-switch feature.
 * @property {function(boolean): void} setConfirmAuto - Sets the confirmation state for auto-switch changes.
 */
export interface PerformanceViewProps {
    setConnectDeviceToggle: (value: boolean) => void;
    handleRefreshClick: () => void;
    autoSwitch: boolean;
    setAutoSwitch: (value: boolean) => void;
    setConfirmAuto: (value: boolean) => void;
}
