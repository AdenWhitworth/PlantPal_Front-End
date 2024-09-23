/**
 * Props for the ToggleSwitch component.
 * 
 * @interface ToggleSwitchProps
 * @property {boolean} checked - Indicates whether the switch is currently checked.
 * @property {function} onChange - Callback function that is called when the switch's checked state changes.
 * @property {string} label - The label to display next to the switch.
 */
export interface ToggleSwitchProps {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}
  