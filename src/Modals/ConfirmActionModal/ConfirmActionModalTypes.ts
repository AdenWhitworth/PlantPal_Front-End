/**
 * Props for the ConfirmActionModal component.
 *
 * @interface ConfirmActionModalProps
 * @property {React.ReactNode} children - The content to be displayed within the modal.
 * @property {string} mainIcon - The source of the main icon to be displayed in the modal.
 * @property {(value: boolean) => void} setAutoSwitch - Function to set the state of the auto switch.
 * @property {(value: boolean) => void} setConfirmAuto - Function to set the confirmation state for auto actions.
 * @property {boolean} autoSwitch - The current state of the auto switch.
 */
export interface ConfirmActionModalProps {
    children: React.ReactNode;
    mainIcon: string;
    setAutoSwitch: (value: boolean) => void;
    setConfirmAuto: (value: boolean) => void;
    autoSwitch: boolean;
}
