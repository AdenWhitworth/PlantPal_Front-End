/**
 * Props for the WedgeGauge component.
 *
 * @interface WedgeGaugeProps
 * @property {string} [className] - Optional class name for custom styling.
 * @property {number} value - The value to be displayed by the gauge, typically between 0 and 100.
 */
export interface WedgeGaugeProps {
    className?: string;
    value: number;
}