/**
 * Represents the props for the PerformanceView component.
 * 
 * @interface PerformanceViewProps
 * @property {function(boolean): void} setConnectDeviceToggle - Toggles the connection device state.
 * @property {function(): void} handleRefreshClick - Handles the action for refreshing data or the view.
 * @property {function(boolean): void} setConfirmAuto - Sets the confirmation state for auto-switch changes.
 */
export interface PerformanceViewProps {
    setConnectDeviceToggle: (value: boolean) => void;
    handleRefreshClick: () => void;
    setConfirmAuto: (value: boolean) => void;
}
