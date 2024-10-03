/**
 * Props for the ConfirmActionModal component.
 *
 * @interface ConfirmActionModalProps
 * @property {React.ReactNode} children - The content to be displayed within the modal.
 * @property {string} mainIcon - The source of the main icon to be displayed in the modal.
 * @property {(value: boolean) => void} setConfirmAuto - Function to set the confirmation state for auto actions.
 */
export interface ConfirmActionModalProps {
    children: React.ReactNode;
    mainIcon: string;
    setConfirmAuto: (value: boolean) => void;
}
