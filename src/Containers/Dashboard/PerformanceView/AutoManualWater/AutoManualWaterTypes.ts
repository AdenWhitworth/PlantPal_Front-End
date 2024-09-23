/**
 * Props for the AutoManualWater component.
 * 
 * @interface AutoManualWaterProps
 * @property {boolean} autoSwitch - Indicates whether the automatic switching is enabled.
 * @property {function} setAutoSwitch - Function to set the state of the auto switch.
 * @property {function} setConfirmAuto - Function to confirm the automatic switching.
 */
export interface AutoManualWaterProps {
    autoSwitch: boolean;
    setAutoSwitch: (value: boolean) => void;
    setConfirmAuto: (value: boolean) => void;
}

/**
 * Represents a water occurrence event.
 * 
 * @interface WaterOccurrence
 * @property {string} date - The date of the water occurrence in ISO format.
 * @property {number} times - The number of times water occurred on the specified date.
 */
export interface WaterOccurrence {
    date: string;
    times: number;
}