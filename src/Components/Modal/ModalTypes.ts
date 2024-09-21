/**
 * Props for the Modal component.
 *
 * @interface ModalProps
 * @property {React.ReactNode} [children] - The content to be displayed inside the modal.
 * @property {boolean} addButton - Whether to display an additional button in the modal.
 * @property {function} [handleButtonClick] - Function to be called when the button is clicked.
 * @property {string} buttonLabel - Label for the button, if displayed.
 * @property {'primary' | 'secondary' | 'tertiary'} styleType - Style type for the button.
 * @property {boolean} addClose - Whether to display a close icon in the modal.
 * @property {function} [handleCloseClick] - Function to be called when the close icon is clicked.
 */
export interface ModalProps { 
    children?: React.ReactNode;
    addButton: boolean;
    handleButtonClick?: () => void;
    buttonLabel: string;
    styleType: 'primary' | 'secondary' | 'tertiary';
    addClose: boolean;
    handleCloseClick?: () => void;
}